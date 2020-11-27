import {Router} from 'express'
import utils from '../utils'

const router = new Router()
router.use(utils.authMiddleware)

router.get('/', async (req, res) => {
    return res.status(200).send([
        "Assisted Living Facility", 
        "Mixed Housing", 
        "Senior Housing",
    ])
})

export default router