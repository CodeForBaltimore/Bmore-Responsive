import app from ".."
import models from '../models'
import randomWords from 'random-words'
import request from "supertest"
import utils from '.'

class Login {
  constructor() {
    this.role = randomWords()
    this.user = { email: `${randomWords()}@test.test`, password: `Abcdefg12!`, roles: [this.role] }
    this.methods = [
      `GET`,
      `POST`,
      `PUT`,
      `DELETE`
    ]
  }

  /**
   * Token setter
   */
  async setToken() {
    await this._createRole()
    await this._createUser()

    this.token = await this._login()
  }

  /**
   * Token getter
   */
  async getToken() {
    return this.token
  }

  /**
   * Destroy temp
   */
  async destroyToken() {
    await this._destroyRole()

    return await this._destroyUser()
  }

  getUserId() {
    return this.user.id
  }

  /**
   * Creates a temp role for testing.
   */
  async _createRole() {
    const e = await utils.loadCasbin()

    for (const method of this.methods) {
      const p = [this.role, '/*', method]
      await e.addPolicy(...p)
    }
  }

  /**
   * Destroys the temp testing role.
   */
  async _destroyRole() {
    const e = await utils.loadCasbin()

    for (const method of this.methods) {
      const p = [this.role, '/*', method]
      await e.removePolicy(...p)
    }
  }

  /**
   * Creates a temp user for testing.
   */
  async _createUser() {
    const user = await models.User.create({ email: this.user.email.toLowerCase(), password: this.user.password });
    this.user.id = user.id
    
    const e = await utils.loadCasbin();
    await e.addRoleForUser(this.user.email.toLowerCase(), this.role);
  }

  /**
   * Destroys temp testing user.
   */
  async _destroyUser() {
    const user = await models.User.findOne({
      where: {
        email: this.user.email.toLowerCase()
      }
    });

    const e = await utils.loadCasbin();
    await e.deleteRolesForUser(this.user.email.toLowerCase());

    await user.destroy();
  }

  /**
   * Login to the API to get a JWT token.
   */
  async _login() {
    const response = await request(app)
      .post('/user/login')
      .send(this.user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)

    return response.text
  }
}

exports.Login = Login
