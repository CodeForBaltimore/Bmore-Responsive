import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import { Login } from '../../utils/login'
import app from '../..'

const VERSION = '1'
const { expect } = chai
const user = { email: `${randomWords()}@test.test`, password: 'Abcdefg42!', roles: ['admin'] }

describe(`User tests (v${VERSION})`, function() {
  const authed = new Login(VERSION)
  let token

  before(async function() {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async function() {
    await authed.destroyToken()
  })

  it('should not login', function(done) {
    request(app)
      .post(`/v${VERSION}/user/login`)
      .send({ email: `${randomWords()}@test.test`, password: 'Abcdefg12!' })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Forbidden')
        done()
      })
  })
  it('should not login with invalid email', function(done) {
    request(app)
      .post(`/v${VERSION}/user/login`)
      .send({ email: randomWords(), password: 'Abcdefg12!' })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should get all users', function(done) {
    request(app)
      .get(`/v${VERSION}/user`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body._meta.total).to.be.greaterThan(0)
        done()
      })
  })
  it('should create a new user', function(done) {
    request(app)
      .post(`/v${VERSION}/user`)
      .set('token', token)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${user.email} created`)
        done()
      })
  })
  it('should get a single user', function(done) {
    request(app)
      .get(`/v${VERSION}/user/${user.email}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send()
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.email).to.equal(user.email)
        done()
      })
  })
  it('should update a user', function(done) {
    user.displayName = randomWords()
    request(app)
      .put(`/v${VERSION}/user`)
      .set('token', token)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${user.email} updated`)
        done()
      })
  })
  it('should request a reset of the password', function(done) {
    request(app)
      .post(`/v${VERSION}/user/reset/${user.email}`)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Password reset email sent')
        done()
      })
  })
  it('should request a reset of the password even with invalid email', function(done) {
    request(app)
      .post(`/v${VERSION}/user/reset/${randomWords()}@test.test`)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Password reset email sent')
        done()
      })
  })
  it('should not request a reset of the password with invalid email format', function(done) {
    request(app)
      .post(`/v${VERSION}/user/reset/${randomWords()}`)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should delete a user', function(done) {
    request(app)
      .delete(`/v${VERSION}/user/${user.email}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send()
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${user.email} deleted`)
        done()
      })
  })
  it('should not login a user', function(done) {
    request(app)
      .post(`/v${VERSION}/user/login`)
      .send({ email: randomWords(), password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should not create a user', function(done) {
    user.email = randomWords()
    request(app)
      .post(`/v${VERSION}/user`)
      .send(user)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Email not in valid format.')
        done()
      })
  })
  it('should not get a single user', function(done) {
    request(app)
      .get(`/v${VERSION}/user/${user.email}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.email).to.be.an('undefined')
        done()
      })
  })
  it('should not update a user', function(done) {
    user.password = randomWords()
    request(app)
      .put(`/v${VERSION}/user`)
      .send(user)
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
    user.password = randomWords()
    request(app)
      .delete(`/v${VERSION}/user/${user.username}`)
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
})
