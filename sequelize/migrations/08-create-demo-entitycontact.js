'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('EntityContacts', {
            id: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                autoIncrement: false,
            },
            entityId: {
                type: Sequelize.UUID
            },
            contactId: {
                type: Sequelize.UUID
            },
            relationshipTitle: {
                type: Sequelize.STRING,
                defaultValue: "default",
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
        return queryInterface.dropTable('EntityContacts');
    }
};
