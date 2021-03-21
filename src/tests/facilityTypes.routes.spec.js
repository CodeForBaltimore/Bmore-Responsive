import chai from 'chai'
import request from 'supertest'
import { Login } from '../utils/login'
import app from '..'

const { assert } = chai

describe('Facility types positive tests', function() {
    const authed = new Login()
    let token
    
    before(async () => {
        await authed.setToken()
        token = await authed.getToken()
    })
    after(async () => {
        await authed.destroyToken()
    })

    it('should get all facility types', done => {
        request(app)
        .get('/facilitytype')
        .set('Accept', 'application/json')
        .set('token', token)
        .expect('Content-Type', 'application/json; charset=utf-8')
        .expect(200)
        .end((err, res) => {
            if (err) return done(err)
            assert.isArray(res.body, 'body is a list')
            done()
        })
    })
})