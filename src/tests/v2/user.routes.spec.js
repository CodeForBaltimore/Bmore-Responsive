import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import app from '../..'

const VERSION = '2'
const { expect } = chai
const user = { email: `${randomWords()}@test.test`, password: 'Abcdefg42!', roles: ['admin'] }

describe(`User tests (v${VERSION})`, function() {
  it('should login', function (done) {
    request(app)
      .post(`/v${VERSION}/user/login`)
      .send({ email: user.email, password: user.password })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) throw err
        expect(res.body.token.length).to.be.greaterThan(0)
        expect(res.body.expiresAt.length).to.be.greaterThan(0)
        done()
      })
  })
  it('should not login', function(done) {
    request(app)
      .post(`/v${VERSION}/user/login`)
      .send({ email: user.email, password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
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
      .send({ email: randomWords(), password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
})
