// import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import app from '..';

// const {expect} = chai;

describe('Model Tests', () => {
    it('should create a user', function(done) {
        request(app)
          .post('/user')
          .send({username: randomWords(),password: randomWords()})
          .set('Accept', 'application/json')
          .expect('Content-Type', 'text/html; charset=utf-8')
          .expect(200)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });
});
