'use strict';
// const db = require('./db');
// const User = require('../models/user')(db.sequelize, db.Sequelize);
// const UserRole = require('../models/user-role')(db.sequelize, db.Sequelize);
const controller = require('../controllers/user');

module.exports = {
  getUsers: async event => {
    const users = await controller.getUsers();

    return {
      statusCode: 200,
      body: JSON.stringify(users)
    };
  }
}
