'use strict';
const utils = require('../utils');
const controller = require('../controllers/user');

const error = {
  statusCode: 500,
  body: 'There was an error.'
};

module.exports = {
  login: async event => {
    try {
      const token = await controller.login(JSON.parse(event.body));
      return token;
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  getUsers: async event => {
    try {
      const users = await controller.getUsers(event.headers.token);

      return {
        statusCode: 200,
        body: JSON.stringify(users),
      };
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  getUser: async event => {
    try {
      const user = await controller.getUser(event.headers.token, event.pathParameters.email);

      return {
        statusCode: 200,
        body: JSON.stringify(user)
      };
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  createUser: async event => {
    try {
      const res = await controller.createUser(JSON.parse(event.body));
      return {
        statusCode: 200,
        body: res
      };
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  updateUser: async event => {
    try {
      if (await utils.validateToken(event.headers.token)) {
        const res = await controller.updateUser(JSON.parse(event.body));
        return {
          statusCode: 200,
          body: res
        };
      }
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  deleteUser: async event => {
    try {
      if (await utils.validateToken(event.headers.token)) {
        const res = await controller.delete(event.pathParameters.email);
        return {
          statusCode: 200,
          body: res
        };
      }
    } catch (e) {
      console.error(e);
      return error;
    }
  }
}
