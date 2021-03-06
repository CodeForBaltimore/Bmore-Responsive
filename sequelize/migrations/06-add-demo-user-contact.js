'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'Contacts',
        'UserId',
        {
            type: Sequelize.UUID,
            references: {
                model: 'Users',
                key: 'id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
      );
  
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn(
        'Contacts',
        'UserId'
      );
    }
  }