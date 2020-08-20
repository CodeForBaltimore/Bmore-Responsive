import { UUIDV4 } from 'sequelize'
import models from './index'

const contact = (sequelize, DataTypes) => {
  // Defining our contact table and setting Contact object.
  const Contact = sequelize.define('Contact', {
    id: {
      type: DataTypes.UUID,
      unique: true,
      primaryKey: true,
      defaultValue: UUIDV4
    },
    UserId: {
      type: DataTypes.UUID,
      references: {
        model: 'User',
        key: 'id',
      },
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      required: true
    },
    phone: {
      type: DataTypes.JSON,
    },
    email: {
      type: DataTypes.JSON,
    },
    attributes: {
      type: DataTypes.JSON,
    }
  },
  {
    schema: process.env.DATABASE_SCHEMA
  })

  Contact.associate = models => {
    Contact.belongsTo(models.User)
    Contact.belongsToMany(models.Entity, {
      through: 'EntityContact',
      as: 'entities',
      foreignKey: 'contactId',
      otherKey: 'entityId'
    })
  }

  Contact.findById = async (id) => {
    const contact = await Contact.findOne({
      where: { id }
    })

    return contact
  }

  Contact.findByUserId = async (UserId) => {
    const contact = await Contact.findOne({
      where: { UserId }
    })

    return contact.dataValues
  }

  Contact.findByName = async (name) => {
    const contact = await Contact.findOne({
      where: { name }
    })

    return contact
  }

  Contact.findContactWithAssociatedEntities = async (contactId) => {
    const contactEntities = await Contact.findOne({
      where: { id: contactId },
      include: [{
        model: models.Entity,
        as: 'entities',
        required: false,
        attributes: ['id', 'name', 'type', 'address', 'phone', 'email', 'checkIn', 'description', 'attributes'],
        through: {
          model: models.EntityContact,
          as: 'entityContacts',
          attributes: ['relationshipTitle']
        }
      }]
    })

    return contactEntities
  }

  return Contact
}

export default contact