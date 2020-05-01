
const userRoles = require('../data/user-role.json');

module.exports = {
	up: queryInterface => {
		const roles = [];
		for (const element of userRoles) {
			roles.push({
				ptype: "p",
				v0: element.role,
				v1: element.path,
				v2: element.method
			});
		}

		return queryInterface.bulkInsert('casbin_rule', roles);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('casbin_rule', null, {});
	}
};
