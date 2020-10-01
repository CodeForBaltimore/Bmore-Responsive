import email from '../email'
import models from '../models'
import utils from '../utils'
import validator from 'validator'
import {Router} from 'express'

const router = new Router()
router.use(utils.authMiddleware)

// Gets all or searches on all contacts.
router.get('/', async (req, res) => {
  const response = new utils.Response()
  try {
    const where = {}
    const types = ['email', 'name', 'phone']
    const jsonTypes = ['email', 'phone']
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

      if (jsonTypes.indexOf(req.query.type) > -1) {
        /** @todo add Sequelize proper WHERE statement for traversing JSON */
      } else {
        where[req.query.type] = req.query.value
      }
    }

    const contacts = await models.Contact.findAll({where})

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

    response.setMessage({
      _meta: {
        // total: contacts.length
        total: Object.keys(results).length
      },
      // results: contacts
      results
    })
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Gets a specific contact.
router.get('/:contact_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await models.Contact.findContactWithAssociatedEntities(req.params.contact_id)

      if (contact === null) {
        response.setCode(404)
      } else {
        response.setMessage(contact)
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

// Creates a new contact.
router.post('/', async (req, res) => {
  const response = new utils.Response()
  try {
    if (req.body.name !== undefined && req.body.name !== '') {
      const {name, phone, email, UserId, entities, attributes} = req.body

      // Validating emails 
      if (email) {
        const goodEmail = await utils.validateEmails(email)
        if (!goodEmail) {
          response.setCode(400)
          response.setMessage('Bad email')
          return res.status(response.getCode()).send(response.getMessage())
        }
      }

      const contact = await models.Contact.create({name, email, phone, UserId, attributes})
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
          await models.EntityContact.createIfNew(ec)
        }
      }

      response.setCode(201)
      response.setMessage(contact.id + ' created')
      response.setHeaders({
        Location: `${req.protocol}://${req.get('host')}/contact/${contact.id}`
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

// Sends emails to contacts based on body
router.post('/send', async (req, res) => {
  const response = new utils.Response()
  try {
    /** @todo allow for passing entity and contact arrays */
    const emails = []
    const {entityIds, contactIds, relationshipTitle} = req.body

    if (entityIds === undefined && contactIds === undefined) {
      const whereClause = (relationshipTitle !== undefined) ? {where: {relationshipTitle}} : {}
      const associations = await models.EntityContact.findAll(whereClause)

      if (associations.length < 1) {
        response.setCode(400)
        response.setMessage('No contacts to email')
        return res.status(response.getCode()).send(response.getMessage())
      }

      for (const association of associations) {
        const contact = await models.Contact.findById(association.contactId)

        if (contact.email !== null) {
          const entity = await models.Entity.findById(association.entityId)
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

    response.setMessage({
      results: {
        message: 'Contacts emailed',
        total: emails.length
      }
    })
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})


router.post('/send/:type/:id', async (req, res) => {
  const response = new utils.Response()

  try {
    if (req.params.type.toLowerCase() === 'entity') {
      const entity = await models.Entity.findById(req.params.id)

      if (entity.email !== null) {
        const primary = entity.email.filter(e => e.isPrimary === 'true').length ? entity.email.filter(e => e.isPrimary === 'true')[0] : entity.email[0]
        console.log(primary)
        // short-lived temporary token that only lasts one hour
        const temporaryToken = await utils.getToken(req.params.id, primary.address, 'Entity')

        const e =  {
          email: primary.address,
          name: entity.name,
          entityName: entity.name,
          entityId: entity.id,
          token: temporaryToken
        }
        email.sendContactCheckInEmail(e).then(() => {
          response.setMessage(`${entity.name} emailed sent.`)
          response.setCode(200)
        }, err => {
          response.setMessage('There was an error: ' + err)
          response.setCode(400)
        })
      } else {
        response.setMessage('Email Address not found.')
        response.setCode(500)
      }

      response.setMessage({
        results: {
          message: `${entity.name} emailed.`,
        }
      })
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }


  return res.status(response.getCode()).send(response.getMessage())
})

// Updates any contact.
router.put('/', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.body.id)) {
      const {id, name, phone, email, UserId, entities, attributes} = req.body

      const contact = await models.Contact.findOne({
        where: {
          id: id
        }
      })

      if (!contact) {
        response.setCode(404)
        return res.status(response.getCode()).send(response.getMessage())
      }

      // Validating emails 
      if (email) {
        const goodEmail = await utils.validateEmails(email)
        if (!goodEmail) {
          response.setCode(400)
          response.setMessage('Bad email')
          return res.status(response.getCode()).send(response.getMessage())
        }
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
          await models.EntityContact.createIfNew(ec)
        }
      }

      response.setMessage(contact.id + ' updated')
    } else {
      response.setCode(400)
    }

  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// Deletes a contact.
router.delete('/:contact_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await models.Contact.findOne({
        where: {
          id: req.params.contact_id
        }
      })
      await contact.destroy()

      response.setMessage(req.params.contact_id + ' deleted')
    } else {
      response.setCode(400)
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

// links contact with list of entities
router.post('/link/:contact_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await models.Contact.findOne({
        where: {
          id: req.params.contact_id
        }
      })

      let i = 0
      for (const entity of req.body.entities) {
        const entityToLink = await models.Entity.findOne({
          where: {
            id: entity.id
          }
        })

        if (contact !== null && entityToLink !== null) {
          const ec = {
            entityId: entityToLink.id,
            contactId: contact.id,
          }

          if (entity.title) {
            ec.relationshipTitle = contact.title
          }

          await models.EntityContact.createIfNew(ec)
          i++
        }
      }

      if (i > 0) {
        response.setMessage(`Linking successful/already exists for contact with ID ${contact.id}`)
      } else {
        response.setCode(400)
        response.setMessage('Bad entities or contact id')
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

// unlinks contact with list of entities
router.post('/unlink/:contact_id', async (req, res) => {
  const response = new utils.Response()
  try {
    if (validator.isUUID(req.params.contact_id)) {
      const contact = await models.Contact.findOne({
        where: {
          id: req.params.contact_id
        }
      })

      let i = 0
      for (const entity of req.body.entities) {
        const entityToUnLink = await models.Entity.findOne({
          where: {
            id: entity.id
          }
        })

        if (contact !== null && entityToUnLink !== null) {
          // ideally only one of these should exist
          const ec = await models.EntityContact.findOne({
            where: {
              entityId: entityToUnLink.id,
              contactId: contact.id
            }
          })

          await ec.destroy()
          i++
        }
      }
      if (i > 0) {
        response.setMessage(`Unlinking successful for contact with ID ${contact.id}`)
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
