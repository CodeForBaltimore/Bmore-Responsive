const uuid = require('uuid4');
const randomWords = require('random-words');
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

		let i = 0;
		do {
			const entityNames = [
				"Springfield Bowlorama",
				"Springfield Nuclear Power Plant",
				"Androids Dungeon",
				"Kwik-E-Mart",
				"Krusty Burger",
				"Duff Brewery",
				"Aztech Theater"
			];
			let name = randomWords();

			let entityId = await queryInterface.sequelize.query(
				`SELECT id FROM ${process.env.DATABASE_SCHEMA}."Entities" WHERE name = '${entityNames[Math.floor(Math.random() * entityNames.length)]}'`
			);

			let contact = {
				id: uuid(),
				createdAt: new Date(),
				updatedAt: new Date(),
				name: name.charAt(0).toUpperCase() + name.slice(1),
				email: JSON.stringify([
				  {
					address: `${randomWords()}@test.test`,
					isPrimary: true
				  }
				]),
				phone: JSON.stringify([
				  {
					number: (Math.floor(Math.random() * Math.floor(100000000000))).toString(),
					isPrimary: true
				  }
				])
			};

			if(entityId[0][0] !== undefined) contact.EntityId = entityId[0][0].id;

			contacts.push(contact);

			i++;
		} while (i < 18);

		return queryInterface.bulkInsert('Contacts', contacts);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Contacts', null, {});
	}
};
