import email from '../email'
import utils from '../utils'
import validator from 'validator'
import { Router } from 'express'

const router = new Router()
router.use(utils.authMiddleware)

// Gets all or searches on all contacts.
router.get('/', async (req, res) => {
  try {
    const where = {}
    const types = ['email', 'name', 'phone']
    const jsonTypes = ['email', 'phone']
    if (Object.keys(req.query).length > 0) {
      if (req.query.type === undefined || req.query.value === undefined) {
        req.context.response.setCode(400)
        req.context.response.setMessage('Invalid query parameters')
        return req.context.response.send()
      } else {
        if (jsonTypes.indexOf(req.query.type) > -1) {
          /** @todo add Sequelize proper WHERE statement for traversing JSON */
        } else {
          if (types.indexOf(req.query.type) < 0) {
            req.context.response.setCode(400)
            req.context.response.setMessage('Invalid query type')
            return req.context.response.send()
          } else {
            where[req.query.type] = req.query.value
          }
        }
      }
    }

    const contacts = await req.context.models.Contact.findAll({ where })

    // Temp fix for JSON types and Sequelize.
    let results = []
    if (req.query.type === 'email') {
      for (const contact of contacts) {
        for (const email of contact.email) {
          if (email.address === req.query.value) {
            results.push(contact)
          }
        }
      }
    }
    if (req.query.type === 'phone') {
      for (const contact of contacts) {
        for (const phone of contact.phone) {
          if (phone.number === req.query.value) {
            results.push(contact)
          }
        }
      }
    }
    if (jsonTypes.indexOf(req.query.type) < 0) results = contacts
    // end temp solution

    req.context.response.setMessage({
      _meta: {
        // total: contacts.length
        total: Object.keys(results).length
      },
      // results: contacts
      results
    })
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// Gets a specific contact.
router.get('/:contact_id', async (req, res) => {
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await req.context.models.Contact.findContactWithAssociatedEntities(req.params.contact_id)

      if (contact === null) {
        req.context.response.setCode(404)
      } else {
        req.context.response.setMessage(contact)
      }
    } else {
      req.context.response.setCode(400)
      req.context.response.setMessage('Invalid UUID')
    }
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// Creates a new contact.
router.post('/', async (req, res) => {
  try {
    if (req.body.name !== undefined && req.body.name !== '') {
      const { name, phone, email, UserId, entities, attributes } = req.body

      // Validating emails 
      if (email) {
        const goodEmail = await utils.validateEmails(email)
        if (!goodEmail) {
          req.context.response.setCode(400)
          req.context.response.setMessage('Bad email')
          return req.context.response.send()
        }
      }

      const contact = await req.context.models.Contact.create({ name, email, phone, UserId, attributes })
      let ec

      if (entities) {
        for (const entity of entities) {
          ec = {
            entityId: entity.id,
            contactId: contact.id
          }
          if (entity.title) {
            ec.relationshipTitle = entity.title
          }
          await req.context.models.EntityContact.createIfNew(ec)
        }
      }

      req.context.response.setCode(201)
      req.context.response.setMessage(contact.id + ' created')
      req.context.response.setHeaders({
        Location: `${req.protocol}://${req.get('host')}/contact/${contact.id}`
      })
    } else {
      req.context.response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// Sends emails to contacts based on body
router.post('/send', async (req, res) => {
  try {
    /** @todo allow for passing entity and contact arrays */
    const emails = []
    const { entityIds, contactIds, relationshipTitle } = req.body

    if (entityIds === undefined && contactIds === undefined) {
      const whereClause = (relationshipTitle !== undefined) ? { where: { relationshipTitle } } : {}
      const associations = await req.context.models.EntityContact.findAll(whereClause)

      for (const association of associations) {
        const contact = await req.context.models.Contact.findById(association.contactId)

        if (contact.email !== null) {
          const entity = await req.context.models.Entity.findById(association.entityId)
          // short-lived temporary token that only lasts one hour
          const temporaryToken = await utils.getToken(contact.id, contact.email[0].address, 'contact')

          emails.push({
            email: contact.email[0].address,
            name: contact.name,
            entityName: entity.name,
            entityId: association.entityId,
            relationshipTitle: association.relationshipTitle,
            token: temporaryToken
          })
        }
      }
    }

    emails.forEach(async (e) => {
      email.sendContactCheckInEmail(e)
    })

    req.context.response.setMessage('contacts emailed')
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// Updates any contact.
router.put('/', async (req, res) => {
  try {
    if (validator.isUUID(req.body.id)) {
      const { id, name, phone, email, UserId, entities, attributes } = req.body

      // Validating emails 
      if (email) {
        const goodEmail = await utils.validateEmails(email)
        if (!goodEmail) {
          req.context.response.setCode(400)
          req.context.response.setMessage('Bad email')
          return req.context.response.send()
        }
      }

      const contact = await req.context.models.Contact.findOne({
        where: {
          id: id
        }
      })

      if (!contact) {
        req.context.response.setCode(404)
        return req.context.response.send()
      }

      contact.name = (name) ? name : contact.name
      contact.phone = (phone) ? phone : contact.phone
      contact.email = (email) ? email : contact.email
      contact.UserId = (UserId) ? UserId : contact.UserId
      contact.updatedAt = new Date()
      contact.attributes = (attributes) ? attributes : contact.attributes

      await contact.save()
      let ec

      if (entities) {
        for (const entity of entities) {
          ec = {
            entityId: entity.id,
            contactId: contact.id
          }
          if (entity.title) {
            ec.relationshipTitle = entity.title
          }
          await req.context.models.EntityContact.createIfNew(ec)
        }
      }

      req.context.response.setMessage(contact.id + ' updated')
    } else {
      req.context.response.setCode(400)
    }

  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// Deletes a contact.
router.delete('/:contact_id', async (req, res) => {
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await req.context.models.Contact.findOne({
        where: {
          id: req.params.contact_id
        }
      })
      await contact.destroy()

      req.context.response.setMessage(req.params.contact_id + ' deleted')
    } else {
      req.context.response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// links contact with list of entities
router.post('/link/:contact_id', async (req, res) => {
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await req.context.models.Contact.findOne({
        where: {
          id: req.params.contact_id
        }
      })
      for (const entity of req.body.entities) {
        const entityToLink = await req.context.models.Entity.findOne({
          where: {
            id: entity.id
          }
        })

        const ec = {
          entityId: entityToLink.id,
          contactId: contact.id,
        }

        if (entity.title) {
          ec.relationshipTitle = contact.title
        }

        await req.context.models.EntityContact.createIfNew(ec)
      }
      req.context.response.setMessage(`Linking successful/already exists for contact with ID ${contact.id}`)
    } else {
      req.context.response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

// unlinks contact with list of entities
router.post('/unlink/:contact_id', async (req, res) => {
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await req.context.models.Contact.findOne({
        where: {
          id: req.params.contact_id
        }
      })
      for (const entity of req.body.entities) {
        const entityToUnLink = await req.context.models.Entity.findOne({
          where: {
            id: entity.id
          }
        })

        // ideally only one of these should exist
        const ec = await req.context.models.EntityContact.findOne({
          where: {
            entityId: entityToUnLink.id,
            contactId: contact.id
          }
        })

        await ec.destroy()
      }
      req.context.response.setMessage(`Unlinking successful for contact with ID ${contact.id}`)
    } else {
      req.context.response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    req.context.response.setCode(500)
  }

  return req.context.response.send()
})

export default router
