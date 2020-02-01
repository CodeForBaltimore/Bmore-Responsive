import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import app from '..';

const {expect} = chai;
const user = {username: randomWords(),password: randomWords()};

describe('User positive tests', () => {
    it('should create a user', function(done) {
        request(app)
          .post('/user')
          .send(user)
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.text).to.equal(`${user.username} created`);
            done();
          });
      });
      it('should get all users', function(done) {
          request(app)
            .get(`/user`)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'application/json; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              expect(res.body.length).to.be.greaterThan(0);
              done();
            });
        });
        it('should get a single user', function(done) {
            request(app)
              .get(`/user/${user.username}`)
              .set('Accept', 'application/json')
              .expect('Content-Type', 'application/json; charset=utf-8')
              .expect(200)
              .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.username).to.equal(user.username);
                done();
              });
          });
      it('should update a user', function(done) {
          user.password = randomWords();
          request(app)
            .put('/user')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end(function(err, res) {
              if (err) return done(err);
              expect(res.text).to.equal(`${user.username} updated`);
              done();
            });
        });
        it('should delete a user', function(done) {
            user.password = randomWords();
            request(app)
              .delete(`/user/${user.username}`)
              .set('Accept', 'application/json')
              .expect('Content-Type', 'text/html; charset=utf-8')
              .expect(200)
              .end(function(err, res) {
                if (err) return done(err);
                expect(res.text).to.equal(`${user.username} deleted`);
                done();
              });
          });
});

describe('User negative tests', () => {
    it('should not create a user', function(done) {
        request(app)
          .post('/user')
          .send()
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(400)
          .end(function(err, res) {
            if (err) return done(err);
            expect(res.text).to.equal('Invalid input')
            done();
          });
      });
        it('should not get a single user', function(done) {
            request(app)
              .get(`/user/${user.username}`)
              .set('Accept', 'application/json')
              .expect(200)
              .end(function(err, res) {
                if (err) return done(err);
                expect(res.body.username).to.be.an('undefined');
                done();
              });
          });
      it('should not update a user', function(done) {
          user.password = randomWords();
          request(app)
            .put('/user')
            .send(user)
            .set('Accept', 'application/json')
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(400)
            .end(function(err, res) {
              if (err) return done(err);
              expect(res.text).to.equal(`Invalid input`);
              done();
            });
        });
        it('should not delete a user', function(done) {
            user.password = randomWords();
            request(app)
              .delete(`/user/${user.username}`)
              .set('Accept', 'application/json')
              .expect('Content-Type', 'text/html; charset=utf-8')
              .expect(400)
              .end(function(err, res) {
                if (err) return done(err);
                expect(res.text).to.equal(`Invalid input`);
                done();
              });
          });
});
