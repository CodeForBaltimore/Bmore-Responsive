const uuid = require('uuid4');
const randomWords = require('random-words');
const contacts = require('../data/contact.json');

module.exports = {
    up: async queryInterface => {
        let entityContacts = [];
        let entityContact = null;
        let entityContactId = null;
        for (const element of contacts) {
            entityContactId = uuid();
            entityContact = {
                id: entityContactId,
                entityId: element.EntityId,
                contactId: element.id,
                relationshipTitle: randomWords(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            entityContacts.push(entityContact)
        }

        return queryInterface.bulkInsert('EntityContacts', entityContacts);
    },
    down: queryInterface => {
        return queryInterface.bulkDelete('EntityContacts', null, {});
    }
};
