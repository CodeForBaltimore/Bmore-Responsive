import chai from 'chai'
import utils from '../utils'
import { Login } from '../utils/login'
import { Response } from '../utils/response'

const { assert, expect } = chai

describe('Utils Tests', function() {
  it('should return 00:00:01', function(done) {
    expect(utils.formatTime(1)).to.equal('00:00:01')
    done()
  })
  it('should validate passwords', function(done) {
    const valid = utils.validatePassword('Abcdef123$')
    expect(valid).to.be.true
    const invalid = utils.validatePassword('abc123')
    expect(invalid).to.be.false
    done()
  })

  describe('Class Tests', function() {
    it('should be an instance of Login', function(done) {
      expect(new Login()).to.be.an.instanceof(Login)
      done()
    })
    it('should be an instance of Response', function(done) {
      expect(new utils.Response()).to.be.an.instanceof(Response)
      done()
    })
    it('should get all codes', function(done) {
      let res = new utils.Response()
      let codes = res.getCodes()
      assert.typeOf(codes, 'object', 'it is an object')
      expect(codes[200]).to.equal('OK')
      done()
    })
    it('should set a default message', function(done) {
      let res = new utils.Response()
      res.setCode(500)
      res.setMessage()

      expect(res.getMessage()).to.equal('Internal Server Error')
      done()
    })
  })
})
