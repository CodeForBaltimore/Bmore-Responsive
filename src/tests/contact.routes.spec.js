import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import { Login } from '../utils/login'
import app from '..'
import { random } from 'lodash'

const { expect } = chai
const contact = {
  name: randomWords(),
  phone: [
    {
      number: (Math.floor(Math.random() * Math.floor(100000000000))).toString()
    }
  ],
  email: [
    {
      address: `${randomWords()}@test.test`
    }
  ]
}

describe('Contact positive tests', () => {
  const authed = new Login()
  let token

  before(async () => {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async () => {
    await authed.destroyToken()
  })

  it('should create a contact', async () => {
    const response = await request(app)
    .post('/contact')
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)

    contact.id = response.text.replace(' created', '')
  })
  it('should get all contacts', (done) => {
    request(app)
      .get(`/contact`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body._meta.total).to.be.greaterThan(0)
        done()
      })
  })
  it('should get a single contact', (done) => {
    request(app)
      .get(`/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.name).to.equal(contact.name)
        done()
      })
  })
  it('should update a contact', (done) => {
    contact.name = randomWords()
    request(app)
      .put(`/contact`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${contact.id} updated`)
        done()
      })
  })
  it('should delete a contact', (done) => {
    request(app)
      .delete(`/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${contact.id} deleted`)
        done()
      })
  })
})

describe('Contact negative tests', () => {
  const authed = new Login()
  let token
  let userId

  before(async () => {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async () => {
    await authed.destroyToken()
  })

  it('should not create a contact', (done) => {
    request(app)
      .post('/contact')
      .set('Accept', 'application/json')
      .set('token', token)
      .send({ name: '' })
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should not get a single contact', (done) => {
    request(app)
      .get(`/contact/${contact.email}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.email).to.be.an('undefined')
        done()
      })
  })
  it('should not update a contact', (done) => {
    contact.email = randomWords()
    contact.id = randomWords()
    request(app)
      .put('/contact')
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Bad Request`)
        done()
      })
  })
  it('should not delete a contact', (done) => {
    contact.email = randomWords()
    request(app)
      .delete(`/contact/${contact.email}`)
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