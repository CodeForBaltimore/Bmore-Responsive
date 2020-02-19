import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import app from '..';
import uuidv4 from 'uuid/v4';

const { expect } = chai;
const contact = {
    id: uuidv4(),
    name: randomWords(), 
    phone: (Math.floor(Math.random() * Math.floor(100000000000))).toString(),
    email: `${randomWords()}@test.test`
};

console.log(contact.id, contact.name, contact.phone, contact.email);

describe.only('Contact positive tests', () => {
  it('should create a contact', (done) => {
    request(app)
      .post('/contact')
      .send(contact)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`${contact.name} created`);
        done();
      });
  });
  it('should get all contacts', (done) => {
    request(app)
      .get(`/contact`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.length).to.be.greaterThan(0);
        done();
      });
  });
  it('should get a single contact', (done) => {
    request(app)
      .get(`/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.email).to.equal(contact.email);
        expect(res.body.name).to.equal(contact.name);
        expect(res.body.phone).to.equal(contact.phone);
        done();
      });
  });
  it('should update a contact', (done) => {
    request(app)
      .put(`/contact/${contact.id}`)
      .send(contact)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`${contact.id} updated`);
        done();
      });
  });
  it('should delete a contact', (done) => {
    request(app)
      .delete(`/contact/${contact.id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal(`${contact.id} deleted`);
        done();
      });
  });
});

describe('Contact negative tests', () => {
  it('should not create a contact', (done) => {
    request(app)
      .post('/contact')
      .send({ email: randomWords(), password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Invalid input')
        done();
      });
  });
  it('should not login a user', (done) => {
    request(app)
      .post('/user/login')
      .send({ email: randomWords(), password: randomWords() })
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Invalid input')
        done();
      });
  });
  it('should not create a user', (done) => {
    request(app)
      .post('/user')
      .send()
      .set('Accept', 'application/json')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.text).to.equal('Invalid input')
        done();
      });
  });
  it('should not get a single user', (done) => {
    request(app)
      .get(`/user/${user.email}`)
      .set('Accept', 'application/json')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.email).to.be.an('undefined');
        done();
      });
  });
  it('should not update a user', (done) => {
    user.password = randomWords();
    request(app)
      .put('/user')
      .send(user)
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
    user.password = randomWords();
    request(app)
      .delete(`/user/${user.username}`)
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
