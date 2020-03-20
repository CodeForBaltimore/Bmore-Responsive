const uuid = require('uuid4');
const contacts = require('../data/contact.json');

module.exports = {
	up: queryInterface => {
		for (const element of contacts) {
			const id = uuid();
			
			element.id = id;
			element.createdAt = new Date();
			element.updatedAt = new Date();
			element.email = JSON.stringify(element.email);
			element.phone = JSON.stringify(element.phone);
		}

		return queryInterface.bulkInsert('Contacts', contacts);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Contacts', null, {});
	}
};
