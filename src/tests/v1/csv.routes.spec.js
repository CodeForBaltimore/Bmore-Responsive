/* eslint-disable no-unused-vars */
import request from 'supertest'
import { Login } from '../../utils/login'
import app from '../..'

const VERSION = '1'
describe('CSV Dump Negative Tests', function() {
  const authed = new Login(VERSION)
  let token

  before(async function() {
    await authed.setToken()
    token = await authed.getToken()
  })
  after(async function() {
    await authed.destroyToken()
  })
  it('Negative Test (400) for CSV Dump on Contact', function(done) {
    request(app)
      .get(`/v${VERSION}/csv/contact`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it('Negative Test (400) for CSV Dump on Entity', function(done) {
    request(app)
      .get(`/v${VERSION}/csv/entity`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it('Negative Test (400) for CSV Dump on User', function(done) {
    request(app)
      .get(`/v${VERSION}/csv/user`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it('Negative Test (400) for CSV Dump on UserRole', function(done) {
    request(app)
      .get(`/v${VERSION}/csv/userRole`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  it('Negative Test (404) for CSV Dump endpoint', function(done) {
    request(app)
      .get(`/v${VERSION}/csv/`)
      .set('Accept', 'application/json')
      .set('token', token)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404)
      .end((err, res) => {
        if (err) return done(err)
        done()
      })
  })

  // it('Negative Test (503) for CSV Dump endpoint', (done) => {
  //   request(app)
  //     .get('/csv/%^&&!@&#)(@*&#()@*&)(*&)(*&(@&#)(!&*#)(*&!@#()*&()*!@&#()*&#&))*&(&()*&#!!@#!@#!@#)(&*)(*&)(*!&#')
  //     .set('Accept', 'application/json')
  //     .set('token', token)
  //     .expect('Content-Type', 'text/html; charset=utf-8')
  //     .expect(503)
  //     .end((err, res) => {
  //       if (err) return done(err)
  //       done()
  //     })
  // })
})
