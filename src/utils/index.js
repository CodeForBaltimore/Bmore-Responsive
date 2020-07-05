'use strict'

import complexity from 'complexity'
import crypto from 'crypto'
import validator from 'validator'
import fs from 'fs'
import jwt from 'jsonwebtoken'
import { newEnforcer } from 'casbin'
import { Response } from './response'
import { SequelizeAdapter } from 'casbin-sequelize-adapter'

const casbinConf = `${__dirname}/casbin.conf`
const rdsCa = fs.readFileSync('./rds-combined-ca-bundle.pem')

/**
 * Formats a timestamp to something readable by humans.
 *
 * @param {Number} seconds
 *
 * @return {String}
 */
const formatTime = seconds => {
  function pad(s) {
    return (s < 10 ? '0' : '') + s
  }

  const hours = Math.floor(seconds / (60 * 60))
  const minutes = Math.floor(seconds % (60 * 60) / 60)
  const secs = Math.floor(seconds % 60)
  return pad(hours) + ':' + pad(minutes) + ':' + pad(secs)
}

/**
 * Loads Casbin for role validation
 * 
 * @returns {Object}
 */
const loadCasbin = async () => {
  const a = (process.env.NODE_ENV === 'production') ? await SequelizeAdapter.newAdapter({
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    logging: false,
    dialect: 'postgres',
    dialectOptions: {
      logging: false,
      ssl: {
        rejectUnauthorized: true,
        ca: [rdsCa],
        checkServerIdentity: (host, cert) => {
          const error = tls.checkServerIdentity(host, cert)
          if (error && !cert.subject.CN.endsWith('.rds.amazonaws.com')) {
            return error
          }
        }
      }
    }
  }) : await SequelizeAdapter.newAdapter({
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    host: process.env.DATABASE_HOST,
    logging: false,
    dialect: 'postgres'
  }
    // dbUrl()
  )

  return await newEnforcer(casbinConf, a)
}

/**
 * Checks a user login token.`
 *
 * This validates a user token. If the token is invalid the request will immediately be rejected back with a 401.
 *
 * @param {*} req The request object.
 * @param {*} res The response object.
 *
 * @return {Boolean}
 */

const validateToken = async req => {
  /** @todo check if it is a token at all */
  if (req.headers.token) {
    try {
      const decoded = jwt.verify(req.headers.token, process.env.JWT_KEY)
      const now = new Date()
      if (now.getTime() < decoded.exp * 1000) {
        const user = (decoded.type === 'contact') ? await req.context.models.Contact.findById(decoded.userId) : await req.context.models.User.findByPk(decoded.userId)
        if (user) {
          req.context.me = user
          return true
        }
      }
    } catch (e) {
      console.error(e)
    }
  }
  return false
}

/**
 * Validates a user role.
 * 
 * @param {*} req The request object
 * 
 * @return {Boolean}
 */
const validateRoles = async (req) => {
  const e = await loadCasbin()
  const { originalUrl: path, method } = req

  /** @todo refactor this... */
  const email = (req.context.me.email[0].address !== undefined) ? req.context.me.email[0].address : req.context.me.email
  const isAllowed = await e.enforce(email, path, method)
  return isAllowed
}

/**
 * Middleware function used to validate a user token
 * 
 * @param {*} req the request object
 * @param {*} res the response object
 * @param {*} next the next handler in the chain
 */
const authMiddleware = async (req, res, next) => {
  let authed = false

  if (process.env.BYPASS_LOGIN) {
    authed = process.env.BYPASS_LOGIN
  } else {
    authed = await validateToken(req)
    if (authed) {
      authed = await validateRoles(req)
    }
  }

  if (authed) {
    next()
  } else {
    response(res, 401, "Unauthorized")
  }
}

/**
 * 
 * @param {*} res the response object
 * @param {Number} code the response code 
 * @param {String} message a custom response message
 */
const response = (res, code, message) => {
  const codes = {
    200: message,
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    422: "Invalid input",
    500: "Server error"
  }

  return res.status(code).send(codes[code])
}

/**
	 * Salts and hashes a password.
	 *
	 * @param {String} password The unhashed or salted password.
	 * @param {String} salt The password salt for this user.
	 *
	 * @return {String} The secured password.
	 */
const encryptPassword = (password, salt) => {
  return crypto
    .createHash('RSA-SHA256')
    .update(password)
    .update(salt)
    .digest('hex')
}

/**
 * Generates a JWT
 * 
 * @param {int} userId 
 * @param {String} email 
 * @param {String} expiresIn 
 * 
 * @returns {String}
 */
const getToken = async (userId, email, type, expiresIn = '1d') => {
  const token = jwt.sign(
    { userId, email, type },
    process.env.JWT_KEY,
    { expiresIn }
  )
  return token
}

/**
 * Checks array of emails for validitiy
 * 
 * @param {Array} emails
 * 
 * @return {Boolean}
 */
const validateEmails = async emails => {
  for (let email of emails) {
    if (!validator.isEmail(email.address)) return false
  }

  return true
}

/**
 * Checks the user's new password for complexity
 * 
 * @param {String} pass 
 * 
 * @return {Boolean}
 */
const validatePassword = pass => {
  const options = {
    uppercase: 1,  // A through Z
    lowercase: 1,  // a through z
    special: 1,  // ! @ # $ & *
    digit: 1,  // 0 through 9
    min: 8,  // minumum number of characters
  }
  return complexity.check(pass, options)
}

/**
 * Processes model results based on type
 *
 * @param {Array} results
 * @param {String} modelType
 *
 * @return {processedResults}
 */
const processResults = async (results, modelType) => {
  switch (modelType) {
    case "Entity":
      let processedResults = []
      for (let result of results) {
        /** @todo expand conditional checking as checkin object becomes more mature */
        if (result["checkIn"] !== null) {
          result["checkIn"] = result["checkIn"].checkIns[0]
        }
        processedResults = [...processedResults, result]
      }
      return processedResults
    default:
      return results
  }
}

const dbUrl = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL
  } else {
    return `postgres://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`
  }
}

export default {
  authMiddleware,
  dbUrl,
  encryptPassword,
  formatTime,
  getToken,
  loadCasbin,
  processResults,
  Response,
  response,
  validateEmails,
  validatePassword
}
