import chai from 'chai'
import request from 'supertest'
import randomWords from 'random-words'
import uuid from 'uuid4'
import { Login } from '../utils/login'
import app from '..'

const { expect } = chai
const entity = {
  name: randomWords(),
  type: 'Test'
}

describe('Entity positive tests', () => {
  const authed = new Login()
  let token

  before(async () => {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async () => {
    await authed.destroyToken()
  })

  it('should create a entity', async () => {
    const response = await request(app)
      .post('/entity')
      .send(entity)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(201)

    entity.id = response.text.replace(' created', '')
  })
  it('should get all entities', (done) => {
    request(app)
      .get(`/entity`)
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
  it('should search on all entities by name', done => {
    request(app)
      .get(`/entity?type=name&value=${entity.name}`)
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
  it('should search on all entities by type', done => {
    request(app)
      .get(`/entity?type=type&value=Test`)
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
  it('should get a single entity', done => {
    request(app)
      .get(`/entity/${entity.id}`)
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
  it('should update an entity', done => {
    entity.name = randomWords()
    request(app)
      .put(`/entity`)
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
  it('Positive Test for CSV Dump on Entity', (done) => {
    request(app)
      .get('/csv/Entity')
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })
  it('should delete an entity', done => {
    request(app)
      .delete(`/entity/${entity.id}`)
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
  it('should not create a entity', (done) => {
    request(app)
      .post('/entity')
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
  it('should not search for entities with bad param types', done => {
    request(app)
      .get(`/entity?test=test`)
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
  it('should not search for entities with bad param values', done => {
    request(app)
      .get(`/entity?type=test&value=test`)
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
  it('should not get a single entity with invalid UUID', (done) => {
    request(app)
      .get(`/entity/${entity.email}`)
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
      .get(`/entity/${uuid()}`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal('Not Found')
        done()
      })
  })
  it('should not update a entity without valid UUID', (done) => {
    entity.id = randomWords()
    request(app)
      .put('/entity')
      .send(entity)
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
  it('should not update a entity with a valid UUID', (done) => {
    entity.id = uuid()
    request(app)
      .put('/entity')
      .send(entity)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.text).to.equal(`Not Found`)
        done()
      })
  })
  it('should not delete a entity', (done) => {
    entity.email = randomWords()
    request(app)
      .delete(`/entity/${entity.email}`)
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
});