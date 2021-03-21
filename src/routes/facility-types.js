import {Router} from 'express'
import utils from '../utils'
import {FACILITY_TYPES} from '../constants/facilities.const'

const router = new Router()
router.use(utils.authMiddleware)

router.get('/', async (req, res) => {
    return res.status(200).send(FACILITY_TYPES)
})

export default router
