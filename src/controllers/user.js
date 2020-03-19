'use strict';
require('dotenv').config();

const validator = require('validator');
const utils = require('../utils');
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
          return {
            statusCode: 200,
            body: token
          }
        }

        return {
          statusCode: 422,
          body: 'Invalid credentials'
        }
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  },
  getUsers: async (token) => {
    try {
      if (await utils.validateToken(token)) {
        const users = await User.findAll({
          attributes: ['email', 'roles', 'displayName', 'phone', 'createdAt', 'updatedAt']
        });

        for (const user of users) {
          user.roles = await UserRole.findRoles(user.roles);
        }

        return {
          _meta: {
            total: users.length
          },
          results: users
        };
      }

      return {
        _meta: {
          total: users.length
        },
        results: users
      }

    } catch (e) {
      console.error(e);
    }

    return false;
  },
  getUser: async (token,email) => {
    try {
      if (validator.isEmail(email) && await utils.validateToken(token)) {
        const user = await User.findOne({
          where: {
            email: email
          },
          attributes: ['email', 'roles', 'displayName', 'phone', 'createdAt', 'updatedAt']
        });
        if (user) {
          user.roles = await UserRole.findRoles(user.roles);
          return user;
        }

        return 'User not found'
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  },
  createUser: async body => {
    try {
      if (validator.isEmail(body.email)) {
        const { email, password, roles } = body;
        const user = await User.create({ email, password, roles });
        return `${user.email} created`;
      }
    } catch (e) {
      console.error(e)
    }

    return false;
  },
  updateUser: async body => {
    try {
      if (validator.isEmail(body.email)) {
        /** @todo add other update options */
        const { email, password } = body;
        const user = await User.findOne({
          where: {
            email
          }
        });
        user.password = password;
        await user.save();
        return `${user.email} updated`;
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  },
  deleteUser: async email => {
    try {
      if (validator.isEmail(email)) {
        const user = await User.findOne({
          where: {
            email: email
          }
        });
        if (user) {
          await user.destroy();
          return `${email} deleted`;
        }

        return 'User not found';
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  }
}
