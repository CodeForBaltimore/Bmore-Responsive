const uuid = require('uuid4');
const randomWords = require('random-words');
const entities = require('../data/entity.json');

module.exports = {
	up: async queryInterface => {

		for (const element of entities) {
			const id = uuid();

			element.id = id;
			element.createdAt = new Date();
			element.updatedAt = new Date();
			element.email = JSON.stringify(element.email);
			element.phone = JSON.stringify(element.phone);
			element.address = JSON.stringify(element.address);
		}
		
		const entityNames = [
			"Springfield Bowlorama",
			"Springfield Nuclear Power Plant",
			"Androids Dungeon",
			"Kwik-E-Mart",
			"Krusty Burger",
			"Duff Brewery",
			"Aztech Theater",
			"The Copy Jalopy"
		];

		for (let name of entityNames) {
			entities.push({
				id: uuid(),
				createdAt: new Date(),
				updatedAt: new Date(),
				name: name,
				type: "Test",
				address: JSON.stringify({
				  street: [
					`123 ${randomWords()} St.`
				  ],
				  city: "Baltimore",
				  state: "MD",
				  zip: "12345",
				  latlng: [
					39.296399,
					-76.607842
				  ]
				}),
				description: randomWords(5)
			});
		}

		return queryInterface.bulkInsert('Entities', entities);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Entities', null, {});
	}
};
