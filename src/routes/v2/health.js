import { Router } from 'express'
import utils from '../../utils'
import { sequelize } from '../../models'

const router = new Router()

const checkDatabase = async () => {
  const databaseCheckResult = {
    'name': 'database',
    'status': 'healthy',
    'message': 'N/A'
  }
  try {
    // https://sequelize.org/docs/v6/getting-started/#testing-the-connection
    await sequelize.authenticate()
  }
  catch (error) {
    console.error(`Database seems to be down: '${error}'`)
    databaseCheckResult.status = 'down'
    databaseCheckResult.message = error.message
  }
  return databaseCheckResult
}

router.get('/', async (req, res) => {
  res.status(200).json({
    uptime: utils.formatTime(process.uptime()),
    environment: process.env.NODE_ENV || 'n/a',
    version: process.env.npm_package_version || 'n/a',
    requestId: req.id,
    checks: [
      await checkDatabase()
    ]
  })
})

export default router