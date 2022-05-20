import chai from 'chai'
import { Login } from '../../utils/login'
import { Response, formatTime, validatePassword } from '../../utils/v1'

const VERSION = '1'
const { assert, expect } = chai

describe(`Utils Tests (v${VERSION})`, function () {
  it('should return 00:00:01', function (done) {
    expect(formatTime(1)).to.equal('00:00:01')
    done()
  })
  it('should validate passwords', function (done) {
    const valid = validatePassword('Abcdef123$')
    expect(valid).to.be.true
    const invalid = validatePassword('abc123')
    expect(invalid).to.be.false
    done()
  })

  describe('Class Tests', function () {
    it('should be an instance of Login', function (done) {
      expect(new Login(VERSION)).to.be.an.instanceof(Login)
      done()
    })
    it('should be an instance of Response', function (done) {
      expect(new Response()).to.be.an.instanceof(Response)
      done()
    })
    it('should get all codes', function (done) {
      let res = new Response()
      let codes = res.getCodes()
      assert.typeOf(codes, 'object', 'it is an object')
      expect(codes[200]).to.equal('OK')
      done()
    })
    it('should set a default message', function (done) {
      let res = new Response()
      res.setCode(500)
      res.setMessage()

      expect(res.getMessage()).to.equal('Internal Server Error')
      done()
    })
  })
})
