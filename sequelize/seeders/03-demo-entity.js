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

		let i = 0;
		const entityNames = [
			"Springfield Bowlorama",
			"Springfield Nuclear Power Plant",
			"Androids Dungeon",
			"Kwik-E-Mart",
			"Krusty Burger",
			"Duff Brewery",
			"Aztech Theater"
		];

		for (let name of entityNames) {
			entities.push({
				id: uuid(),
				createdAt: new Date(),
				updatedAt: new Date(),
				name: name,
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

		// do {
		// 	let name = randomWords();
		// 	entities.push({
		// 		id: uuid(),
		// 		createdAt: new Date(),
		// 		updatedAt: new Date(),
		// 		name: name.charAt(0).toUpperCase() + name.slice(1),
		// 		address: JSON.stringify({
		// 		  street: [
		// 			"123 Anyplace St."
		// 		  ],
		// 		  city: "Baltimore",
		// 		  state: "MD",
		// 		  zip: "12345",
		// 		  latlng: [
		// 			39.296399,
		// 			-76.607842
		// 		  ]
		// 		}),
		// 		description: randomWords(5)
		// 	});
		// 	i++;
		// } while (i < 26);


		return queryInterface.bulkInsert('Entities', entities);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Entities', null, {});
	}
};
