import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import app from '..';

const { describe, before, it} = chai;
const { expect } = chakram; // use the chakram expectations
const { serviceUrl, login } = require('../data/config');

const user = { email: `${randomWords()}@test.test`, password: randomWords(), roles: [1] };
const chakram = require('chakram');





/** @todo add JWT validation tests */

{
    module.exports = () => {
        let tokenHeader;
        before(async () => {
            tokenHeader = {Authorization: await login()};
        });
        describe('User positive tests', () => {
            it('should create a user', (done) => {
                request(app)
                    .post('/user')
                    .send(user)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.text).to.equal(`${user.email} created`);
                        done();
                    });
            });
            it('should login a user', (done) => {
                request(app)
                    .post('/user/login')
                    .send(user)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        done();
                    });
            });
            it('should get all users', (done) => {
                request(app)
                    .get(`/user`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body._meta.total).to.be.greaterThan(0);
                        done();
                    });
            });
            it('should get a single user', (done) => {
                request(app)
                    .get(`/user/${user.email}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'application/json; charset=utf-8')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.body.email).to.equal(user.email);
                        done();
                    });
            });
            it('should update a user', (done) => {
                user.password = randomWords();
                request(app)
                    .put('/user')
                    .send(user)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.text).to.equal(`${user.email} updated`);
                        done();
                    });
            });
            it('should delete a user', (done) => {
                request(app)
                    .delete(`/user/${user.email}`)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', 'text/html; charset=utf-8')
                    .expect(200)
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(res.text).to.equal(`${user.email} deleted`);
                        done();
                    });
            });
        });
    }
    describe('User negative tests', () => {
        it('should not login a user', (done) => {
            request(app)
                .post('/user/login')
                .send({email: randomWords(), password: randomWords()})
                .set('Accept', 'application/json')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(422)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.text).to.equal('Invalid input')
                    done();
                });
        });
        it('should not create a user', (done) => {
            user.email = randomWords();
            request(app)
                .post('/user')
                .send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(422)
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
                .expect(422)
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
                .expect(422)
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
                .expect(422)
                .end((err, res) => {
                    if (err) return done(err);
                    expect(res.text).to.equal(`Invalid input`);
                    done();
                });
        });
    });
}
