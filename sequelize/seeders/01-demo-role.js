
const userRoles = require('../data/user-role.json');
const casbin = require('casbin');
const csa = require('casbin-sequelize-adapter');

const casbinConf = `${__dirname}/casbin.conf`;

module.exports = {
	up: queryInterface => {
		return queryInterface.bulkInsert('casbin_rule', userRoles);
	},
	down: queryInterface => {
		return queryInterface.bulkDelete('casbin_rule', null, {});
	}
};
