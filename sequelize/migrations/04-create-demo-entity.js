'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('Entities', {
			id: {
			  type: Sequelize.UUID,
			  primaryKey: true,
			  allowNull: false,
			  autoIncrement: false,
			},
            name : {
                type: Sequelize.STRING,
                required: true
			},
			type : {
				type: Sequelize.STRING
			},
            address: {
                type: Sequelize.JSON,
			},
            phone: {
                type: Sequelize.JSON,
            },
            email: {
                type: Sequelize.JSON,
			},
			description: {
				type: Sequelize.STRING
			},
			checkIn: {
				type: Sequelize.JSON,
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
		return queryInterface.dropTable('Entities');
	}
};
