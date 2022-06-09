'use strict'

import jwt from 'jsonwebtoken'
import fs from 'fs'
import tls from 'tls'
import { dirname } from 'path'
import { SequelizeAdapter } from 'casbin-sequelize-adapter'
import { newEnforcer } from 'casbin'
import { ErrorResponse } from './errorResponse'

const casbinConf = `${dirname(__dirname)}/casbin.conf`
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

// Reusable adapter for minimizing database connection usage
var adapter

/**
 * Loads Casbin for role validation
 *
 * @returns {Object}
 */
const getRoleEnforcer = async () => {
  if (!adapter) {

    let dialectOptions
    if (process.env.NODE_ENV === 'production') {
      dialectOptions = {
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
    }

    adapter = await SequelizeAdapter.newAdapter({
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      host: process.env.DATABASE_HOST,
      logging: process.env.NODE_ENV === 'production',
      dialect: 'postgres',
      dialectOptions
    })
  }

  return newEnforcer(casbinConf, adapter)
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
  var authHeader = req.headers['authorization'] || ''
  var authToken = authHeader.split(/\s+/).pop() || req.headers.token
  if (authToken) {
    try {
      const decoded = jwt.verify(authToken, process.env.JWT_KEY)
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
  const roleEnforcer = await getRoleEnforcer()
  const { originalUrl: path, method } = req

  /** @todo refactor this... */
  const email = (req.context.me.email[0].address !== undefined) ? req.context.me.email[0].address : req.context.me.email
  return roleEnforcer.enforce(email, path, method)

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
    let response = new ErrorResponse(403)
    res.status(response.getCode()).json(response.getBody())
  }
}

export {
  formatTime,
  ErrorResponse,
  authMiddleware,
  getRoleEnforcer,
  validateRoles
}
