import { Router } from 'express'
import { formatTime } from '../../utils/v1'

const router = new Router()

router.get('/', (req, res) => {
  res.status(200).json({
    uptime: formatTime(process.uptime()),
    environment: process.env.NODE_ENV || 'n/a',
    version: process.env.npm_package_version || 'n/a',
    requestId: req.id
  })
})

export default router