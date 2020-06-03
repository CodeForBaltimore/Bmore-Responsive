import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import { Login } from '../utils/login';
import app from '..';

const { expect } = chai;
const entity = {
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
};

describe('Entity positive tests', () => {
  const authed = new Login();
  let token;

  before(async () => {
    await authed.setToken();
    token = authed.getToken();
  });
  after(async () => {
    await authed.destroyToken();
  });

  it('should create a entity', (done) => {
    request(app)
      .post('/entity')
      .send(entity)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        // expect(res.text).to.equal(`${entity.id} created`);
        done();
      });
  });
  it('should get all entities', (done) => {
    request(app)
      .get(`/entity`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body._meta.total).to.be.greaterThan(0);
        done();
      });
  });
});

describe('Entity negative tests', () => {
  it('should not create a entity', (done) => {
    request(app)
      .post('/entity')
      .send({ name: '' })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Invalid input')
        done();
      });
  });
  it('should not get a single entity', (done) => {
    request(app)
      .get(`/entity/${entity.email}`)
      .set('Accept', 'application/json')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.email).to.be.an('undefined');
        done();
      });
  });
  it('should not update a entity', (done) => {
    entity.email = randomWords();
    entity.id = randomWords();
    request(app)
      .put('/entity')
      .send(entity)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`Invalid input`);
        done();
      });
  });
  it('should not delete a entity', (done) => {
    entity.email = randomWords();
    request(app)
      .delete(`/entity/${entity.email}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`Invalid input`);
        done();
      });
  });
});