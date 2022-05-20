import chai from 'chai'
import { Login } from '../../utils/login'
import { Response } from '../../utils/v2'

const VERSION = '2'
const { assert, expect } = chai

describe(`Utils Tests (v${VERSION})`, function () {
  describe('Class Tests', function () {
    it('should be an instance of Login', function (done) {
      const login_instance = new Login(VERSION)
      expect(login_instance).to.be.an.instanceof(Login)
      expect(login_instance.DEFAULT_API_VERSION).to.be.equal(VERSION)
      done()
    })
    it('should be an instance of Response', function (done) {
      const res = new Response()
      expect(res).to.be.an.instanceof(Response)
      expect(res.getCode()).to.equal(200)
      done()
    })
    it('should get all default code messages', function (done) {
      const res = new Response()
      const defaultCodeMessages = res.getDefaultCodeMessages()
      assert.typeOf(defaultCodeMessages, 'object', 'it is an object')
      expect(defaultCodeMessages[200]).to.equal('OK')
      done()
    })
    it('should set a default message', function (done) {
      const res = new Response()
      const defaultCodeMessages = res.getDefaultCodeMessages()
      const code = 500
      res.setCode(code)

      expect(JSON.stringify(res.getBody())).to.equal(JSON.stringify({
        'message': defaultCodeMessages[code],
        'statusCode': code
      }))
      done()
    })
    it('should add a detail', function (done) {
      const res = new Response()
      const defaultCodeMessages = res.getDefaultCodeMessages()
      const code = 400
      res.setCode(code)
      res.addDetail('test', 'it works')

      expect(JSON.stringify(res.getBody())).to.equal(JSON.stringify({
        'message': defaultCodeMessages[code],
        'statusCode': code,
        'details': [{'name': 'test', 'value': 'it works'}]
      }))
      done()
    })
    it('should set a custom message', function (done) {
      const res = new Response()
      res.setMessage('test')

      expect(JSON.stringify(res.getBody())).to.equal(JSON.stringify({
        'message': 'test',
        'statusCode': 200,
      }))
      done()
    })
    it('should set header', function (done) {
      const res = new Response()
      const test_header = {'test': 'header'}
      res.setHeaders(test_header)

      expect(res.getHeaders()).to.equal(test_header)
      done()
    })
  })
})
