const uuid = require('uuid4');
const entities = require('../data/entity.json');

module.exports = {
	up: queryInterface => {

		for (const element of entities) {
			const id = uuid();

			element.id = id;
			element.createdAt = new Date();
			element.updatedAt = new Date();
			element.email = JSON.stringify(element.email);
			element.phone = JSON.stringify(element.phone);
		}

		return queryInterface.bulkInsert('Entities', entities);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Entities', null, {});
	}
};
