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
  ],
  entities: []
}
const entity = {
  name: randomWords(),
  type: 'Test'
}

describe('Contact tests', function() {
  const authed = new Login()
  let token
  let authHeader

  before(async function() {
    await authed.setToken()
    token = await authed.getToken()
    authHeader =  'Bearer ' + token

    const entityResponse = await request(app)
      .post('/entity')
      .send(entity)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)

    entity.id = entityResponse.text.replace(' created', '')
    contact.entities.push({ id: entity.id, title: 'test' })
  })
  after(async function() {
    await request(app)
      .delete(`/entity/${entity.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
    await authed.destroyToken()
  })

  it('should create a contact', async function() {
    const response = await request(app)
      .post('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)

    contact.id = response.text.replace(' created', '')
  })
  it('should get all contacts', function(done) {
    request(app)
      .get('/contact')
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
  it('should search on all contacts by name', function(done) {
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
  it('should search on all contacts by email', function(done) {
    request(app)
      .get(`/contact?type=email&value=${contact.email[0].address}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body._meta.total).to.be.greaterThan(0)
        done()
      })
  })
  it('should search on all contacts by phone', function(done) {
    request(app)
      .get(`/contact?type=phone&value=${contact.phone[0].number}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body._meta.total).to.be.greaterThan(0)
        done()
      })
  })
  it('should get a single contact', function(done) {
    request(app)
      .get(`/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.name).to.equal(contact.name)
        done()
      })
  })
  it('Sending email to entity contacts', function(done) {
    try {
      request(app)
        .post('/contact/send')
        .set('Accept', 'application/json')
        .set('authorization', authHeader)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          expect(res.text).to.equal('Contacts emailed')
          done()
        })
    } catch(e) {
      console.error(e)
    }
  })
  it('should not update a contact with invalid email', function(done) {
    contact.email[0].address = randomWords()
    request(app)
      .put('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad email')
        done()
      })
  })
  it('should update a contact', function(done) {
    contact.email[0].address = `${randomWords()}@test.test`
    request(app)
      .put('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${contact.id} updated`)
        done()
      })
  })
  it('should add an entity to a contact', function(done) {
    const entityIds = { entities: [{ id: entity.id, title: 'test' }] }
    request(app)
      .post(`/contact/link/${contact.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(entityIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Linking successful/already exists for contact with ID ${contact.id}`)
        done()
      })
  })
  it('should not add an entity to a contact with invalid entity id', function(done) {
    const entityIds = { entities: [{ id: uuid() }] }
    request(app)
      .post(`/contact/link/${contact.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(entityIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad entities or contact id')
        done()
      })
  })
  it('should not add an entity to a contact with invalid contact id', function(done) {
    const entityIds = { entities: [{ id: uuid() }] }
    request(app)
      .post('/contact/link/abc123')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(entityIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should not remove an entity to a contact with invalid entity id', function(done) {
    const entityIds = { entities: [{ id: uuid() }] }
    request(app)
      .post(`/contact/unlink/${contact.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(entityIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad link sent')
        done()
      })
  })
  // it('should not add an entity to a contact with invalid contact id', function(done) {
  //   const entityIds = { entities: [{ id: uuid() }] }
  //   request(app)
  //     .post('/contact/unlink/abc123')
  //     .set('Accept', 'application/json')
  //     .set('authorization', authHeader)
  //     .send(entityIds)
  //     .expect('Content-Type', 'text/html; charset=utf-8')
  //     .expect(400)
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       expect(res.text).to.equal('Bad Request')
  //       done()
  //     })
  // })
  it('should unlink the entity and contact', function(done) {
    const entityIds = { entities: [{ id: entity.id }] }
    request(app)
      .post(`/contact/unlink/${contact.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(entityIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Unlinking successful for contact with ID ${contact.id}`)
        done()
      })
  })
  it('Positive Test for CSV Dump on Contact', function(done) {
    request(app)
      .get('/csv/Contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      // eslint-disable-next-line no-unused-vars
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })
  it('should delete a contact', function(done) {
    request(app)
      .delete(`/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${contact.id} deleted`)
        done()
      })
  })

  it('should not create a contact with null name', function(done) {
    request(app)
      .post('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send({ name: '' })
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should not create a contact with invalid email', function(done) {
    request(app)
      .post('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send({ name: randomWords(), email: [{address: randomWords()}] })
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad email')
        done()
      })
  })
  it('should not search for contacts with bad param types', function(done) {
    request(app)
      .get('/contact?test=test')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Invalid query parameters')
        done()
      })
  })
  it('should not search for contacts with bad param values', function(done) {
    request(app)
      .get('/contact?type=test&value=test')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Invalid query type')
        done()
      })
  })
  it('should not get a single contact with invalid UUID', function(done) {
    request(app)
      .get(`/contact/${contact.email}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.email).to.be.an('undefined')
        done()
      })
  })
  it('should not get a single contact with valid UUID', function(done) {
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
  it('should not update a contact without valid UUID', function(done) {
    contact.id = randomWords()
    request(app)
      .put('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('should not update a single contact with valid UUID', function(done) {
    contact.id = uuid()
    request(app)
      .put('/contact')
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .send(contact)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Not Found')
        done()
      })
  })
  it('should not delete a contact', function(done) {
    contact.email = randomWords()
    request(app)
      .delete(`/contact/${contact.email}`)
      .set('Accept', 'application/json')
      .set('authorization', authHeader)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
})
