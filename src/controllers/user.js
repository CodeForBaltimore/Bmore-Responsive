'use strict';
require('dotenv').config();

const db = require('../lambda/db');
const User = require('../models/user')(db.sequelize, db.Sequelize);
const UserRole = require('../models/user-role')(db.sequelize, db.Sequelize);

module.exports = {
  getUsers: async () => {
    try {
      const users = await User.findAll({
        attributes: ['email', 'roles', 'displayName', 'phone', 'createdAt', 'updatedAt']
      });

      for (const user of users) {
        user.roles = await UserRole.findRoles(user.roles);
      }

      return users;
    } catch (e) {
      console.error(e);
    }

    return false;
  }
}
