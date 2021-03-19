const uuid = require('uuid4');
const faker = require('faker');

import models from '../../src/models'

module.exports = {
  up: async queryInterface => {
    let entityContacts = []
    let entityContact
    let entitiesMutable = await models.Entity.findAll()
    let numberOfLinks
    let entityToLinkIndex
    for (const contact of await models.Contact.findAll()) {
      // links between 1 and 4
      numberOfLinks = Math.floor(Math.random() * 4 + 1)
      for (let linkIndex = 0; linkIndex <= numberOfLinks; linkIndex++) {
        entityToLinkIndex = Math.floor(Math.random() * entitiesMutable.length)
        if (entitiesMutable[entityToLinkIndex] != null) {
          entityContact = {
            id: uuid(),
            entityId: entitiesMutable[entityToLinkIndex].id,
            contactId: contact.id,
            relationshipTitle: faker.name.title(),
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          entityContacts.push(entityContact)
          // delete entity from list so it doesn't link twice
          entitiesMutable.splice(entityToLinkIndex, 1)
        } else {
          break
        }
      }
    }
    return queryInterface.bulkInsert('EntityContacts', entityContacts)
  },
  down: queryInterface => {
    return queryInterface.bulkDelete('EntityContacts', null, {})
  }
}
