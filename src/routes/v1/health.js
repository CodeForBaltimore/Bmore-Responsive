import { Router } from 'express'
import utils from '../../utils'

const router = new Router()

router.get('/', (req, res) => {
  res.status(200).json({
    uptime: utils.formatTime(process.uptime()),
    environment: process.env.NODE_ENV || 'n/a',
    version: process.env.npm_package_version || 'n/a',
    requestId: req.id
  })
})

export default router