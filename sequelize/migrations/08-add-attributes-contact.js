'use strict';
module.exports = {
    up: function(queryInterface, Sequelize) {
      return queryInterface.addColumn(
        'Contacts',
        'attributes',
        {
            type: Sequelize.JSON
        }
      );
  
    },
  
    down: function(queryInterface, Sequelize) {
      return queryInterface.removeColumn(
        'Contacts',
        'attributes'
      );
    }
  }