import chai from 'chai'
import request from 'supertest'
import app from '../..'

const VERSION = '1'
const {expect} = chai

describe(`API Integration Tests (v${VERSION})`, function() {
  it('should return uptime', function(done) {
    request(app)
      .get(`/v${VERSION}/health`)
      .end((err, res) => {
        if (err) {
          console.error(`IT uptime error: ${err}`)
        }

        expect(res.body.uptime).to.be.ok
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it('should return environment', function(done) {
    request(app)
      .get(`/v${VERSION}/health`)
      .end((err, res) => {
        if (err) {
          console.error(`IT environment error: ${err}`)
        }

        expect(res.body.environment).to.be.ok
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it('should return version number', function(done) {
    request(app)
      .get(`/v${VERSION}/health`)
      .end((err, res) => {
        if (err) {
          console.error(`IT version error: ${err}`)
        }

        expect(res.body.version).to.be.ok
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it('should return request id', function(done) {
    request(app)
      .get(`/v${VERSION}/health`)
      .end((err, res) => {
        if (err) {
          console.error(`IT version error: ${err}`)
        }

        expect(res.body.requestId).to.be.ok
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
  it('should serve home request', function(done) {
    request(app)
      .get('/')
      .end((err, res) => {
        if (err) {
          console.error(`IT version error: ${err}`)
        }
        expect(res.statusCode).to.equal(302)
        done()
      })
  })
  it('should redirect help request', function(done) {
    request(app)
      .get('/help')
      .end((err, res) => {
        if (err) {
          console.error(`IT version error: ${err}`)
        }
        expect(res.statusCode).to.equal(302)
        done()
      })
  })
  it('should return swagger', function(done) {
    request(app)
      .get(`/v${VERSION}/api-docs/`)
      .end((err, res) => {
        if (err) {
          console.error(`IT version error: ${err}`)
        }
        expect(res.statusCode).to.equal(200)
        done()
      })
  })
})
