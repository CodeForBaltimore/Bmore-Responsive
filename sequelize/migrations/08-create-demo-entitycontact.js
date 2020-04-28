'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.createTable('EntityContacts', {
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
            }),
            queryInterface.removeColumn('Contacts', 'EntityId'),
        ]);
    },
    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.dropTable('EntityContacts'),
            queryInterface.addColumn(
                'Contacts',
                'EntityId',
                {
                    type: Sequelize.UUID,
                    references: {
                        model: 'Entities',
                        key: 'id'
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'SET NULL'
                }
              ),
        ]);
    }
};
