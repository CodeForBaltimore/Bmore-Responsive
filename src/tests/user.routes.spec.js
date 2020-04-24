import chai from 'chai';
import request from 'supertest';
import randomWords from 'random-words';
import app from '..';
import {login, createUser} from '../utils/login'

const {expect} = chai;
const user = {email: `${randomWords()}@test.test`, password: randomWords(), roles: [1]};


/** @todo add JWT validation tests */


describe('User positive tests', () => {
    let tokenHeader;
    before(async () => {
        await createUser(user)
        tokenHeader = {token: await login(user)};
    });
    it('should get all users', (done) => {
        request(app)
            .get(`/user`)
            .set('Accept', 'application/json')
            .set('token', tokenHeader.token)
            .send()
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
            .set('token', tokenHeader.token)
            .send()
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
            .set('token', tokenHeader.token)
            .set('Accept', 'application/json')
            .send()
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
            .set('token', tokenHeader.token)
            .send()
            .expect('Content-Type', 'text/html; charset=utf-8')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.text).to.equal(`${user.email} deleted`);
                done();
            });
    });
});

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
