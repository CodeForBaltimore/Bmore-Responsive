'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('CheckIns', {
			id: {
			  type: Sequelize.UUID,
			  primaryKey: true,
			  allowNull: false,
			  autoIncrement: false,
			},
            notes : {
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
		return queryInterface.dropTable('CheckIns');
	}
};
