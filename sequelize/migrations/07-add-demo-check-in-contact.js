'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'CheckIns',
        'ContactId',
        {
            type: Sequelize.UUID,
            references: {
                model: 'Contacts',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
      );
  
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn(
        'CheckIns',
        'ContactId'
      );
    }
  }