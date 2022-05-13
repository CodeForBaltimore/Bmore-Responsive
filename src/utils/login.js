import app from '..'
import models from '../models'
import randomWords from 'random-words'
import request from 'supertest'
import utils from './v1'

class Login {
  constructor(version = (process.env.DEFAULT_API_VERSION || '1')) {
    this.DEFAULT_API_VERSION = version
    this.role = randomWords()
    this.user = { email: `${randomWords()}@test.test`, password: 'Abcdefg12!', roles: [this.role] }
    this.methods = [
      'GET',
      'POST',
      'PUT',
      'DELETE'
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
    const user = await models.User.create({ email: this.user.email.toLowerCase(), password: this.user.password })
    this.user.id = user.id

    const e = await utils.loadCasbin()
    await e.addRoleForUser(this.user.email.toLowerCase(), this.role)
    // await models.UserRole.create({
    //   ptype: 'g',
    //   v0: this.email.toLowerCase(),
    //   v1: this.role
    // })
  }

  /**
   * Destroys temp testing user.
   */
  async _destroyUser() {
    const user = await models.User.findOne({
      where: {
        email: this.user.email.toLowerCase()
      }
    })

    const e = await utils.loadCasbin()
    await e.deleteRolesForUser(this.user.email.toLowerCase())
    // const roles = await models.UserRole.findAll({
    //   where: {
    //     v0: this.email.toLowerCase()
    //   }
    // })

    // for (const role of roles) {
    //   await role.destroy()
    // }

    await user.destroy()
  }

  /**
   * Login to the API to get a JWT token.
   */
  async _login() {
    let response;
    switch (this.DEFAULT_API_VERSION) {
      case '1':
        response = await request(app)
          .post('/v1/user/login')
          .send(this.user)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
        return response.text
      case '2':
        response = await request(app)
          .post(`/v2/security/authenticate`)
          .send(this.user)
          .set('Accept', 'application/json')
          .expect(200)
        return response.token
    }
  }
}

exports.Login = Login
