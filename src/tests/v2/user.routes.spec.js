import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import jwt from 'jsonwebtoken'
import app from '../..'
import { Login } from '../../utils/login'

const VERSION = '2'
const { expect } = chai

describe(`User tests (v${VERSION})`, function() {
  const testUser = new Login(VERSION)
  let token

  before(async function() {
    await testUser.setToken()
    token = await testUser.getToken()
  })
  after(async function() {
    await testUser.destroyToken()
    process.env.BYPASS_LOGIN = true
  })

  it('should login', function (done) {
    request(app)
      .post(`/v${VERSION}/security/authenticate`)
      .send({ email: testUser.user.email, password: testUser.user.password })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        expect(res.body.token).to.be.equal(token)
        const { exp } = jwt.decode(token)
        expect(res.body.expiresAt).to.be.equal(exp)
        done()
      })
  })
  it('should not login', function(done) {
    request(app)
      .post(`/v${VERSION}/security/authenticate`)
      .send({ email: testUser.user.email, password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.message).to.equal('Invalid credentials')
        expect(res.body.statusCode).to.equal(401)
        done()
      })
  })
  it('should not login with invalid email', function(done) {
    request(app)
      .post(`/v${VERSION}/security/authenticate`)
      .send({ email: randomWords(), password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.message).to.equal('Request invalid')
        expect(res.body.statusCode).to.equal(400)
        expect(res.body.details).to.eql([{'name': 'email', 'value': 'Address provided is invalid'}])
        done()
      })
  })
  it('should get all users', function(done) {
    request(app)
      .get(`/v${VERSION}/users`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).to.deep.include.members([{email: testUser.user.email, displayName: testUser.user.displayName}])
        done()
      })
  })
  it('should not get all users', function(done) {
    process.env.BYPASS_LOGIN = false
    request(app)
      .get(`/v${VERSION}/users`)
      .set('Accept', 'application/json')
      .set('token', randomWords())
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(403)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.statusCode).to.equal(403)
        expect(res.body.message).to.equal('Access not permitted')
        done()
      })
  })
})
