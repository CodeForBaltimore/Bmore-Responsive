const uuid = require('uuid4')
const faker = require('faker');

module.exports = {
	up: async queryInterface => {
		const contacts = []
		let i = 0
		do {
			let contact = {
				id: uuid(),
				createdAt: new Date(),
				updatedAt: new Date(),
				name: faker.name.findName(),
				email: JSON.stringify([
				  {
					address: `${faker.internet.userName()}@test.test`,
					isPrimary: true
				  }
				]),
				phone: JSON.stringify([
				  {
					number: faker.phone.phoneNumber(),
					isPrimary: true
				  }
				])
			}

			contacts.push(contact)
			i++
		} while (i < 18)

		return queryInterface.bulkInsert('Contacts', contacts)
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('Contacts', null, {})
	}
}
