import { UUIDV4 } from 'sequelize'
import utils from '../utils'
import models from '../models'

const entityContact = (sequelize, DataTypes) => {
  // Defining our EntityContact object.
  const EntityContact = sequelize.define('EntityContact', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    entityId: {
      type: DataTypes.UUID,
      references: {
        model: 'Entity',
        key: 'id'
      }
    },
    contactId: {
      type: DataTypes.UUID,
      references: {
        model: 'Contact',
        key: 'id'
      }
    },
    relationshipTitle: {
      type: DataTypes.STRING,
      defaultValue: 'default',
    }
  },
  {
    schema: process.env.DATABASE_SCHEMA
  })

  EntityContact.createIfNew = async (ec) => {
    let whereQuery = { 
      entityId: ec.entityId,
      contactId: ec.contactId,
    }
    if (ec.relationshipTitle) {
      whereQuery.relationshipTitle = ec.relationshipTitle
    }
    const ecObject = await EntityContact.findOne({
      where: whereQuery
    })
    if (!ecObject) {
      await EntityContact.create(ec)
    }

    // Grant perms on checkins
    const contact = await models.Contact.findById(ec.contactId)

    if (typeof contact.email !== 'undefined' && contact.email.length > 0) {
      const e = await utils.loadCasbin()
      for (const email of contact.email) {
        const p = [email.address, `/entity/${ec.entityId}`, '(GET)|(POST)']
        await e.addPolicy(...p)
      }
    }
  }

  EntityContact.findByEntityId = async (entityId) => {
    const entries = await EntityContact.findAll({
      where: {entityId}
    })

    return entries
  }

  return EntityContact
}

export default entityContact
