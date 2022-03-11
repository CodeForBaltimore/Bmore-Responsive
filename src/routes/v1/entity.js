import { Router } from 'express'
import validator from 'validator'
import utils from '../../utils'

const router = new Router()
router.use(utils.authMiddleware)

// Gets all or searches on all entities.
router.get('/', async (req, res) => {
  const response = new utils.Response()
  try {
    const where = {}
    const types = ['name', 'type']

    if (Object.keys(req.query).length > 0) {
      if (req.query.type === undefined || req.query.value === undefined) {
        response.setCode(400)
        response.setMessage('Invalid query parameters')
        return res.status(response.getCode()).send(response.getMessage())
      }
      if (types.indexOf(req.query.type) < 0) {
        response.setCode(400)
        response.setMessage('Invalid query type')
        return res.status(response.getCode()).send(response.getMessage())
      }

      where[req.query.type] = req.query.value
    }

    const entities = await req.context.models.Entity.findAll({ where })

    response.setMessage({
      _meta: {
        total: entities.length
      },
      results: entities
    })
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Gets a specific entity.
router.get('/:entity_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.entity_id)) {
      const entity = await req.context.models.Entity.findEntityWithAssociatedContacts(req.params.entity_id)

      if (entity === null) {
        response.setCode(404)
      } else {
        response.setMessage(entity)
      }
    } else {
      response.setCode(400)
      response.setMessage('Invalid UUID')
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Creates a new entity.
router.post('/', async (req, res) => {
  const response = new utils.Response()
  try {
    if (req.body.name !== undefined && req.body.name !== '' && req.body.type !== undefined && req.body.type !== '') {
      let { name, type, address, phone, email, checkIn, contacts } = req.body

      if (!checkIn) {
        checkIn = {
          _meta: {
            total: 0
          },
          checkIns: []
        }
      }

      const entity = await req.context.models.Entity.create({ name, type, address, email, phone, checkIn })
      if (contacts) {
        for (const contact of contacts) {
          const ec = {
            entityId: entity.id,
            contactId: contact.id
          }
          if (contact.title) {
            ec.relationshipTitle = contact.title
          }
          await req.context.models.EntityContact.createIfNew(ec)
        }
      }

      response.setCode(201)
      response.setMessage(entity.id + ' created')
      response.setHeaders({
        Location: `${req.protocol}://${req.get('host')}/entity/${entity.id}`
      })
    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  if (response.getHeaders() !== null) res.set(response.getHeaders())
  return res.status(response.getCode()).send(response.getMessage())
})

// Updates any entity.
router.put('/', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.body.id)) {
      let { id, name, type, address, phone, email, checkIn, contacts, attributes } = req.body

      /** @todo validate emails */
      // Validating emails
      // if (await !utils.validateEmails(email)) res.status(500).send('Server error')

      let entity = await req.context.models.Entity.findOne({
        where: {
          id: id
        }
      })

      if (!entity) {
        response.setCode(404)
        return res.status(response.getCode()).send(response.getMessage())
      }

      entity.name = (name) ? name : entity.name
      entity.type = (type) ? type : entity.type
      entity.address = (address) ? address : entity.address
      entity.phone = (phone) ? phone : entity.phone
      entity.email = (email) ? email : entity.email
      entity.attributes = (attributes) ? attributes : entity.attributes
      /** @todo validate checkIn JSON */
      if (entity.checkIn === null && checkIn) {
        const checkIns = {
          _meta: {
            total: 1
          },
          checkIns: [
            checkIn
          ]
        }

        entity.checkIn = checkIns
      } else if (entity.checkIn !== null && checkIn) {
        let checkIns = entity.checkIn.checkIns
        checkIns.push(checkIn)
        let total = entity.checkIn._meta.total + 1

        const update = {
          _meta: {
            total: total
          },
          checkIns: checkIns
        }

        entity.checkIn = update
      }

      entity.updatedAt = new Date()

      await entity.save()

      if (contacts) {
        for (const contact of contacts) {
          const ec = {
            entityId: entity.id,
            contactId: contact.id
          }
          if (contact.title) {
            ec.relationshipTitle = contact.title
          }
          await req.context.models.EntityContact.createIfNew(ec)
        }
      }

      response.setMessage(entity.id + ' updated')
    } else {
      response.setCode(400)
    }

  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Deletes a entity.
router.delete('/:entity_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.entity_id)) {
      const entity = await req.context.models.Entity.findOne({
        where: {
          id: req.params.entity_id
        }
      })
      await entity.destroy()


      response.setMessage(req.params.entity_id + ' deleted')
    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// links entity with list of contacts
router.post('/link/:entity_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.entity_id)) {
      const entity = await req.context.models.Entity.findOne({
        where: {
          id: req.params.entity_id
        }
      })
      for (const contact of req.body.contacts) {
        const contactToLink = await req.context.models.Contact.findOne({
          where: {
            id: contact.id
          }
        })

        const ec = {
          entityId: entity.id,
          contactId: contactToLink.id
        }

        if (contact.title) {
          ec.relationshipTitle = contact.title
        }

        await req.context.models.EntityContact.createIfNew(ec)
      }
      response.setMessage(`Linking successful/already exists for entity with ID ${entity.id}`)

    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// unlinks entity with list of contacts
router.post('/unlink/:entity_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.entity_id)) {
      const entity = await req.context.models.Entity.findOne({
        where: {
          id: req.params.entity_id
        }
      })

      let i = 0
      for (const contact of req.body.contacts) {
        const contactToUnLink = await req.context.models.Contact.findOne({
          where: {
            id: contact.id
          }
        })

        // ideally only one of these should exist
        const ec = await req.context.models.EntityContact.findOne({
          where: {
            entityId: entity.id,
            contactId: contactToUnLink.id
          }
        })

        if (ec != null) {
          await ec.destroy()
          i++
        }
      }

      if (i > 0) {
        response.setMessage(`Unlinking successful for entity with ID ${entity.id}`)
      } else {
        response.setCode(400)
        response.setMessage('Bad link sent')
      }
    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

export default router
