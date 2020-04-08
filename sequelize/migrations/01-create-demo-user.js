'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Users', {
			id: {
			  type: Sequelize.UUID,
			  primaryKey: true,
			  allowNull: false,
			  autoIncrement: false,
			},
			email: {
				allowNull: false,
				unique: true,
				type: Sequelize.STRING
			},
			password: {
				allowNull: false,
				type: Sequelize.STRING
			},
			salt: {
				type: Sequelize.STRING
			},
			token: {
				type: Sequelize.STRING
			},
			roles: {
				type: Sequelize.JSON
			},
			displayName: {
				type: Sequelize.STRING
			},
			phone: {
				type: Sequelize.STRING
			},
			attributes: {
				type: Sequelize.JSON,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: queryInterface => {
		return queryInterface.dropTable('Users');
	}
};
