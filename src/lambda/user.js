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
      return {
        statusCode: 200,
        body: token
      };
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  getUsers: async event => {
    try {
      if (await utils.validateToken(event.headers.token)) {
        const users = await controller.getUsers();

        return {
          statusCode: 200,
          body: JSON.stringify(users)
        };
      }
    } catch (e) {
      console.error(e);
      return error;
    }
  },
  getUser: async event => {
    try {
      if (await utils.validateToken(event.headers.token)) {
        const user = await controller.getUser(event.pathParameters.email);

        return {
          statusCode: 200,
          body: JSON.stringify(user)
        };
      }
    } catch (e) {
      console.error(e);
      return error;
    }
  }
}
