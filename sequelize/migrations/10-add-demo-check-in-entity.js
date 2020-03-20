'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'CheckIns',
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
      );
  
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn(
        'CheckIns',
        'EntityId'
      );
    }
  }