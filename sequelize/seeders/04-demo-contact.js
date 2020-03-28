const uuid = require('uuid4');
const contacts = require('../data/contact.json');

module.exports = {
	up: async queryInterface => {
		for (const element of contacts) {
			const id = uuid();
			
			element.id = id;
			element.createdAt = new Date();
			element.updatedAt = new Date();
			element.email = JSON.stringify(element.email);
			element.phone = JSON.stringify(element.phone);

			if (element.EntityId) {
				const entityId = await queryInterface.sequelize.query(
					`SELECT id FROM ${process.env.DATABASE_SCHEMA}."Entities" WHERE name = '${element.EntityId}'`
				);
				element.EntityId = entityId[0][0].id;
			}
		}

		return queryInterface.bulkInsert('Contacts', contacts);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Contacts', null, {});
	}
};
