'use strict';
require('dotenv').config();

const validator = require('validator');
const db = require('../lambda/db');
const User = require('../models/user')(db.sequelize, db.Sequelize);
const UserRole = require('../models/user-role')(db.sequelize, db.Sequelize);

module.exports = {
  login: async body => {
    try {
      const { email, password } = body;
      if (validator.isEmail(email)) {
        const token = await User.findByLogin(email, password);
        if (token) {
          console.log(token);
          return token;
        }
      }

      throw new Error('Invalid input');
    } catch (e) {
      console.error(e);
    }

    return false;
  },
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
  },
  getUser: async (email) => {
    try {
      if (validator.isEmail(email)) {
        const user = await User.findOne({
          where: {
            email: email
          },
          attributes: ['email', 'roles', 'displayName', 'phone', 'createdAt', 'updatedAt']
        });
        if (user) user.roles = await UserRole.findRoles(user.roles);
        return user;
      }

      throw new Error('Invalid input');
      return email;
    } catch (e) {
      console.error(e);
    }

    return false;
  }
}
