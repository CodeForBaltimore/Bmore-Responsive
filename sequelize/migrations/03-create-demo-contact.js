'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Contacts', {
			id: {
			  type: Sequelize.UUID,
			  primaryKey: true,
			  allowNull: false,
			  autoIncrement: false,
			},
            name : {
                type: Sequelize.STRING,
                unique: true,
                required: true
            },
            phone: {
                type: Sequelize.STRING,
                unique: true,
                required: true
            },
            email: {
                type: Sequelize.STRING,
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
		return queryInterface.dropTable('Contacts');
	}
};
