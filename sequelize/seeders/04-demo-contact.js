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
				"Aztech Theater",
				"The Copy Jalopy",
				"99¢ Furniture Store",
				"Little Lisa Recycling Plant",
				"Acne Grease and Shovel",
				"Buzz Cola",
				"Classy Jos",
				"Compu-Global-Hyper-Mega-Net",
				"Springfield Gas Company",
				"U-Break-It Van Rental",
				"Uncle Homers Daycare Center",
				"Ziffcorp",
				"Burns Slant Drilling Co.",
				"Springfield Gorge",
				"Springfield Tire Yard",
				"The Murderhorn",
				"Nuclear Lake"
			];
			let name = randomWords();

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

			contacts.push(contact);
			i++;
		} while (i < 18);

		return queryInterface.bulkInsert('Contacts', contacts);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Contacts', null, {});
	}
};
