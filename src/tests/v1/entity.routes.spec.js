import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import uuid from 'uuid4'
import { Login } from '../../utils/login'
import app from '../..'

const VERSION = '1'
const { expect } = chai
const entity = {
  name: randomWords(),
  type: 'Test',
  contacts: [],
  attributes: {
    notes: 'test'
  }
}
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

describe(`Entity tests (v${VERSION})`, function() {
  const authed = new Login(VERSION)
  let token

  before(async function() {
    await authed.setToken()
    token = await authed.getToken()

    const contactResponse = await request(app)
      .post(`/v${VERSION}/contact`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contact)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)

    contact.id = contactResponse.text.replace(' created', '')
    entity.contacts.push({ id: contact.id, title: 'test' })
  })
  after(async function() {
    await request(app)
      .delete(`/v${VERSION}/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
    await authed.destroyToken()
  })

  it('should create a entity', async function() {
    const response = await request(app)
      .post(`/v${VERSION}/entity`)
      .send(entity)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)

    entity.id = response.text.replace(' created', '')
  })
  it('should get all entities', function(done) {
    request(app)
      .get(`/v${VERSION}/entity`)
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
  it('should search on all entities by name', function(done) {
    request(app)
      .get(`/v${VERSION}/entity?type=name&value=${entity.name}`)
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
  it('should search on all entities by type', function(done) {
    request(app)
      .get(`/v${VERSION}/entity?type=type&value=Test`)
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
  it('should get a single entity', function(done) {
    request(app)
      .get(`/v${VERSION}/entity/${entity.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.name).to.equal(entity.name)
        done()
      })
  })
  it('should update an entity', function(done) {
    entity.name = randomWords()
    entity.checkIn = { test: 'test' }
    request(app)
      .put(`/v${VERSION}/entity`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(entity)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${entity.id} updated`)
        done()
      })
  })
  it('should add an contact to an entity', function(done) {
    const contactIds = { contacts: [{ id: contact.id, title: 'test' }] }
    request(app)
      .post(`/v${VERSION}/entity/link/${entity.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contactIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Linking successful/already exists for entity with ID ${entity.id}`)
        done()
      })
  })
  it('should not add an contact to an entity', function(done) {
    const contactIds = { contacts: [{ id: uuid() }] }
    request(app)
      .post(`/v${VERSION}/entity/link/abc123`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contactIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })



  it('should remove a contact from an entity', function(done) {
    const contactIds = { contacts: [{ id: contact.id, title: 'test' }] }
    request(app)
      .post(`/v${VERSION}/entity/unlink/${entity.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contactIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Unlinking successful for entity with ID ${entity.id}`)
        done()
      })
  })
  it('should not remove a contact from an entity', function(done) {
    const contactIds = { contacts: [{ id: uuid() }] }
    request(app)
      .post(`/v${VERSION}/entity/unlink/abc123`)
      .set('Accept', 'application/json')
      .set('token', token)
      .send(contactIds)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Bad Request')
        done()
      })
  })
  it('Positive Test for CSV Dump on Entity', function(done) {
    request(app)
      .get(`/v${VERSION}/csv/Entity`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(200)
      // eslint-disable-next-line no-unused-vars
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })
  it('should delete an entity', function(done) {
    request(app)
      .delete(`/v${VERSION}/entity/${entity.id}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`${entity.id} deleted`)
        done()
      })
  })
  it('should not create a entity', function(done) {
    request(app)
      .post(`/v${VERSION}/entity`)
      .send({ name: '' })
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
  it('should not search for entities with bad param types', function(done) {
    request(app)
      .get(`/v${VERSION}/entity?test=test`)
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
  it('should not search for entities with bad param values', function(done) {
    request(app)
      .get(`/v${VERSION}/entity?type=test&value=test`)
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
  it('should not get a single entity with invalid UUID', function(done) {
    request(app)
      .get(`/v${VERSION}/entity/${entity.email}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body.email).to.be.an('undefined')
        done()
      })
  })
  it('should not get a single entity with valid UUID', function(done) {
    request(app)
      .get(`/v${VERSION}/entity/${uuid()}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Not Found')
        done()
      })
  })
  it('should not update a entity without valid UUID', function(done) {
    entity.id = randomWords()
    request(app)
      .put(`/v${VERSION}/entity`)
      .send(entity)
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
  it('should not update a entity with a valid UUID', function(done) {
    entity.id = uuid()
    request(app)
      .put(`/v${VERSION}/entity`)
      .send(entity)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Not Found')
        done()
      })
  })
  it('should not delete a entity', function(done) {
    entity.email = randomWords()
    request(app)
      .delete(`/v${VERSION}/entity/${entity.email}`)
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
