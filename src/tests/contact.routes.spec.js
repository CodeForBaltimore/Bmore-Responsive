import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import uuid from 'uuid4'
import { Login } from '../utils/login'
import app from '..'

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
  it('should get all contacts', done => {
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
  it('should search on all contacts by name', done => {
    request(app)
      .get(`/contact?type=name&value=${contact.name}`)
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
  it('should search on all contacts by email', done => {
    request(app)
      .get(`/contact?type=email&value=${contact.email[0].address}`)
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
  it('should search on all contacts by phone', done => {
    request(app)
      .get(`/contact?type=phone&value=${contact.phone[0].number}`)
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
  it('should get a single contact', done => {
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
  it('should not update a contact with invalid email', done => {
    contact.email[0].address = randomWords()
    request(app)
      .put('/contact')
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad email')
        done()
      })
  })
  it('should update a contact', done => {
    contact.email[0].address = `${randomWords()}@test.test`
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
  it('Positive Test for CSV Dump on Contact', (done) => {
    request(app)
      .get('/csv/Contact')
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })
  it('should delete a contact', done => {
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

  it('should not create a contact with null name', done => {
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
  it('should not create a contact with invalid email', done => {
    request(app)
      .post('/contact')
      .set('Accept', 'application/json')
      .set('token', token)
      .send({ name: randomWords(), email: [{address: randomWords()}] })
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad email')
        done()
      })
  })
  it('should not search for contacts with bad param types', done => {
    request(app)
      .get(`/contact?test=test`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Invalid query parameters')
        done()
      })
  })
  it('should not search for contacts with bad param values', done => {
    request(app)
      .get(`/contact?type=test&value=test`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Invalid query type')
        done()
      })
  })
  it('should not get a single contact with invalid UUID', done => {
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
  it('should not get a single contact with valid UUID', done => {
    request(app)
      .get(`/contact/${uuid()}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Not Found')
        done()
      })
  })
  it('should not send emails', done => {
    request(app)
      .post(`/contact/send`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`No contacts to email`)
        done()
      })
  })
  it('should not update a contact without valid UUID', done => {
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
  it('should not update a single contact with valid UUID', done => {
    contact.id = uuid()
    request(app)
      .put(`/contact`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Not Found')
        done()
      })
  })
  it('should not delete a contact', done => {
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