const userRoles = require('../data/user-role.json');

module.exports = {
	up: queryInterface => {
		for (const element of userRoles) {
			element.createdAt = new Date();
			element.updatedAt = new Date();
		}

		return queryInterface.bulkInsert('UserRoles', userRoles);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('UserRoles', null, {});
	}
};
