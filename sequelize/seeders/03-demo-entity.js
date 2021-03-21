const uuid = require('uuid4');
const randomWords = require('random-words');
const faker = require('faker');
import _ from 'lodash'
import { FACILITY_TYPES } from '../../src/constants/facilities.const'

module.exports = {
	up: async queryInterface => {
		let entities = []
		const numberOfEntities = 25
		
		for (let i = 0; i < numberOfEntities; i++) {
			const state = faker.address.stateAbbr()
			entities.push({
				id: uuid(),
				createdAt: new Date(),
				updatedAt: new Date(),
				name: faker.company.companyName(),
				type: _.sample(FACILITY_TYPES),
				address: JSON.stringify({
				  street: [
					faker.address.streetAddress()
				  ],
				  city: faker.address.city(),
				  state: state,
				  zip: faker.address.zipCodeByState(state),
				  latlng: [
					faker.address.latitude(),
					faker.address.longitude(),
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
