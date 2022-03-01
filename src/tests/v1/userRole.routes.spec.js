import chai from 'chai'
import request from 'supertest'
import { Login } from '../../utils/login'
import app from '../..'

const VERSION = '1';
const { expect, assert } = chai
const role = { role: 'test' + Date.now(), path: '/test', method: 'GET' }

describe('User roles positive tests', function() {
  const authed = new Login(VERSION)
  let token

  before(async function() {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async function() {
    await authed.destroyToken()
  })

  it('should create a user role', function(done) {
    request(app)
      .post(`/v${VERSION}/userRole`)
      .send(role)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('policy created')
        done()
      })
  })
  it('should get all user roles', function(done) {
    request(app)
      .get(`/v${VERSION}/userRole`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        assert.isObject(res.body, 'body is an object')
        done()
      })
  })
  it('should delete a user role', function(done) {
    request(app)
      .post(`/v${VERSION}/userRole/delete`)
      .send(role)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Policy deleted')
        done()
      })
  })

  it('should not create a user role', function(done) {
    request(app)
      .post(`/v${VERSION}/userRole`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should not delete a user', function(done) {
    request(app)
      .post(`/v${VERSION}/userRole/delete`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Request does not inclue required parameters')
        done()
      })
  })
})
