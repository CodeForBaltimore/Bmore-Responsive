import chai from 'chai'
import utils from '../utils'
import { Login } from '../utils/login'
import { Response } from '../utils/response'

const { expect, assert } = chai

describe('Utils Tests', () => {
  it('should return 00:00:01', done => {
    expect(utils.formatTime(1)).to.equal('00:00:01')
    done()
  })
  it('should validate passwords', done => {
    const valid = utils.validatePassword('Abcdef123$')
    expect(valid).to.be.true
    const invalid = utils.validatePassword('abc123')
    expect(invalid).to.be.false
    done()
  })
})

describe('Class Tests', () => {
  it('should be an instance of Login', done => {
    expect(new Login()).to.be.an.instanceof(Login)
    done()
  })
  it('should be an instance of Response', done => {
    expect(new utils.Response()).to.be.an.instanceof(Response)
    done()
  })
})