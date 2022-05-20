import chai from 'chai'
import { Login } from '../../utils/login'
import { ErrorResponse, formatTime } from '../../utils/v2'

const VERSION = '2'
const { assert, expect } = chai

describe(`Utils Tests (v${VERSION})`, function () {
  it('should return 00:00:01', function (done) {
    expect(formatTime(1)).to.equal('00:00:01')
    done()
  })

  describe('Class Tests', function () {
    it('should be an instance of Login', function (done) {
      const login_instance = new Login(VERSION)
      expect(login_instance).to.be.an.instanceof(Login)
      expect(login_instance.DEFAULT_API_VERSION).to.be.equal(VERSION)
      done()
    })
    it('should be an instance of ErrorResponse', function (done) {
      const res = new ErrorResponse()
      expect(res).to.be.an.instanceof(ErrorResponse)
      expect(res.getCode()).to.equal(404)
      done()
    })
    it('should get all default code messages', function (done) {
      const code = 404
      const res = new ErrorResponse(code)
      const defaultCodeMessages = res.getDefaultCodeMessages()
      assert.typeOf(defaultCodeMessages, 'object', 'it is an object')
      expect(defaultCodeMessages[code]).to.equal('Not Found')
      done()
    })
    it('should add a detail', function (done) {
      const code = 400
      const res = new ErrorResponse(code)
      const defaultCodeMessages = res.getDefaultCodeMessages()
      res.addDetail('test', 'it works')

      expect(JSON.stringify(res.getBody())).to.equal(JSON.stringify({
        'message': defaultCodeMessages[code],
        'statusCode': code,
        'details': [{'name': 'test', 'value': 'it works'}]
      }))
      done()
    })
    it('should set a custom message', function (done) {
      const code = 404
      const res = new ErrorResponse(code)
      res.setMessage('test')

      expect(JSON.stringify(res.getBody())).to.equal(JSON.stringify({
        'message': 'test',
        'statusCode': code,
      }))
      done()
    })
  })
})
