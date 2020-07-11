import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import { Login } from '../utils/login'
import app from '..'
import { random } from 'lodash'

const { expect } = chai
const user = { email: `${randomWords()}@test.test`, password: `Abcdefg42!`, roles: ["admin"] }

describe('User tests', () => {
  const authed = new Login()
  let token

  before(async () => {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async () => {
    await authed.destroyToken()
  })

  it('should not login', (done) => {
    request(app)
      .post('/user/login')
      .send({ email: `${randomWords()}@test.test`, password: `Abcdefg12!` })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(403)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Forbidden`)
        done()
      })
  })
  it('should not login with invalid email', (done) => {
    request(app)
      .post('/user/login')
      .send({ email: randomWords(), password: `Abcdefg12!` })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Bad Request`)
        done()
      })
  })
  it('should get all users', (done) => {
    request(app)
      .get(`/user`)
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
  it('should create a new user', (done) => {
    request(app)
      .post('/user')
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
  it('should get a single user', (done) => {
    request(app)
      .get(`/user/${user.email}`)
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
  it('should update a user', (done) => {
    user.displayName = randomWords()
    request(app)
      .put('/user')
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
  it('should request a reset of the password', (done) => {
    request(app)
      .post(`/user/reset/${user.email}`)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Password reset email sent`)
        done()
      })
  })
  it('should request a reset of the password even with invalid email', (done) => {
    request(app)
      .post(`/user/reset/${randomWords()}@test.test`)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Password reset email sent`)
        done()
      })
  })
  it('should not request a reset of the password with invalid email format', (done) => {
    request(app)
      .post(`/user/reset/${randomWords()}`)
      .send(user)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Bad Request`)
        done()
      })
  })
  it('should delete a user', (done) => {
    request(app)
      .delete(`/user/${user.email}`)
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
  it('should not login a user', (done) => {
    request(app)
      .post('/user/login')
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
  it('should not create a user', (done) => {
    user.email = randomWords()
    request(app)
      .post('/user')
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
  it('should not get a single user', (done) => {
    request(app)
      .get(`/user/${user.email}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.email).to.be.an('undefined')
        done()
      })
  })
  it('should not update a user', (done) => {
    user.password = randomWords()
    request(app)
      .put('/user')
      .send(user)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Bad Request`)
        done()
      })
  })
  it('should not delete a user', (done) => {
    user.password = randomWords()
    request(app)
      .delete(`/user/${user.username}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Bad Request`)
        done()
      })
  })
})
