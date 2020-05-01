'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('casbin_rule', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			ptype: {
				type: Sequelize.STRING
			},
			v0: {
				type: Sequelize.STRING
			},
			v1: {
				type: Sequelize.STRING
			},
			v2: {
				type: Sequelize.STRING
			},
			v3: {
				type: Sequelize.STRING
			},
			v4: {
				type: Sequelize.STRING
			},
			v5: {
				type: Sequelize.STRING
			},
		});
	},
	down: queryInterface => {
		return queryInterface.dropTable('casbin_rule');
	}
};
