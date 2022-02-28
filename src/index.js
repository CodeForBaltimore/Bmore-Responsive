import 'dotenv/config'

import fs from 'fs'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import nunjucks from 'nunjucks'
import requestId from 'express-request-id'
import rateLimit from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express'
import models, { sequelize } from './models'

const DEFAULT_VERSION = '1'
const app = express()
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }'
}
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
})

nunjucks.configure('mail_templates', { autoescape: true })
const logLevel = (process.env.NODE_ENV === 'production') ? 'common' : 'dev'

// Third-party middleware
app.use(requestId())
app.use(morgan(logLevel))
app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
if (process.env.NODE_ENV === 'production') app.use(apiLimiter)

// Custom middleware
app.use(async (req, res, next) => {
  req.context = {
    models,
    // e: await utils.loadCasbin()
  }

  next()
})

// Helper endpoints
app.get('/', (req, res) => {
  res.redirect(`/v${DEFAULT_VERSION}/api-docs`)
})
app.get('/help', (req, res) => {
  res.redirect(`/v${DEFAULT_VERSION}/api-docs`)
})

// Api Docs
const apiVersions = fs.readdirSync(`${__dirname}/api-docs`)
for (const version of apiVersions) {
  const swaggerDocument = require(`./api-docs/${version}/swagger.json`)
  app.use(`/${version}/api-docs`, apiLimiter, swaggerUi.serve, (req, res) => {
    let html = swaggerUi.generateHTML(swaggerDocument);
    res.send(html);
  })
}

// Routes
const routeVersions = fs.readdirSync(`${__dirname}/routes`)
for (const version of routeVersions) {
  const routers = require(`./routes/${version}`)
  for (const [routeName, routeFunction] of Object.entries(routers)) {
    app.use(`/${version}/${routeName}`, routeFunction)
  }
}

// Handle 404
app.use((req, res) => {
  return res.status(404).send('Not Found')
})

// Handle 503
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  console.error(error)
  return res.status(503).send('Service Unavailable')
})

// Starting Express and connecting to PostgreSQL
try {
  sequelize.sync().then(() => {
    if(require.main === module){
      app.listen(process.env.PORT || 3000, () => {
        console.log(`Bmore Responsive is available at http://localhost:${process.env.PORT || 3000}`)
      })
    }
  })
} catch (e) {
  console.error(e)
}

export default app
