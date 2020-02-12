import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import app from '..';

const { expect } = chai;
const role = { role: randomWords(), description: randomWords() };

describe('User roles positive tests', () => {
    it('should create a user role', (done) => {
      request(app)
        .post('/userRole')
        .send(role)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal(`${role.role} created`);
          done();
        });
    });
    it('should get all user roles', (done) => {
      request(app)
        .get(`/userRole`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.length).to.be.greaterThan(0);
          done();
        });
    });
    it('should get a single user', (done) => {
      request(app)
        .get(`/userRole/${role.role}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.role).to.equal(role.role);
          role.id = res.body.id;
          done();
        });
    });
    it('should update a user role', (done) => {
      role.description = randomWords();
      request(app)
        .put('/userRole')
        .send(role)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal(`${role.role} updated`);
          done();
        });
    });
    it('should delete a user role', (done) => {
      request(app)
        .delete(`/userRole/${role.role}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal(`${role.role} deleted`);
          done();
        });
    });
});

describe('User role negative tests', () => {
    it('should not create a user role', (done) => {
      request(app)
        .post('/userRole')
        .send({ role: '', description: randomWords() })
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal('Invalid input')
          done();
        });
    });
    it('should not get a single user role', (done) => {
      request(app)
        .get(`/userRole/${role.role}`)
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.role).to.be.an('undefined');
          done();
        });
    });
    it('should not update a user role', (done) => {
      role.description = randomWords();
      request(app)
        .put('/userRole')
        .send(role)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal(`Invalid input`);
          done();
        });
    });
    it('should not delete a user', (done) => {
      request(app)
        .delete(`/userRole/${role.role}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.text).to.equal(`Invalid input`);
          done();
        });
    });
  });