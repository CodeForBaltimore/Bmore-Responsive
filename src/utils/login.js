// libraries
import request from "supertest";
import app from "..";
import user from "../models/user";

const {describe, it} = require('mocha');


const createUser = async (user) => {
    // it('should create a user', async() => {
    await request(app)
        .post('/user')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200)
    // .end((err, res) => {
    //     if (err) return done(err);
    //     expect(res.text).to.equal(`${user.email} created`);
    //     done();
    // });
    // });
}
/**
 * Login to the API to get a JWT token.
 */
const login = async (user) => {
    // let response
    // it ('should login with token', async() => {
    // get token response from api
    const response = await request(app)
        .post('/user/login')
        .send(user)
        .set('Accept', 'application/json')
        .expect('Content-Type', 'text/html; charset=utf-8')
        .expect(200);
    // });
    return response.text;
};
module.exports = {
    login: login,
    createUser
}
