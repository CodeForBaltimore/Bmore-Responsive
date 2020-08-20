import { Router } from 'express'
import utils from '../utils'
import { parseAsync } from 'json2csv'

const router = new Router()
router.use(utils.authMiddleware)

// Gets a data dump from the passed in model (if it exists).
router.get('/:model_type', async (req, res) => {
  const response = new utils.Response()
  const modelType = req.params.model_type
  try {
    /** @todo refactor this when we change how CSV's are delivered. */
    // eslint-disable-next-line no-prototype-builtins
    if (req.context.models.hasOwnProperty(modelType) && modelType !== 'User' && modelType !== 'UserRole') {
      /** @todo add filtering */
      const results = await req.context.models[modelType].findAll({ raw: true })

      const processedResults = await utils.processResults(results, modelType)

      if (results.length !== 0) {
        response.setMessage = await parseAsync(JSON.parse(JSON.stringify(processedResults)), Object.keys(results[0]), {})
      }
    } else {
      response.setCode(400)
      response.setMessage('Model type is invalid')
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
  }

  return res.status(response.getCode()).send(response.getMessage())
})

export default router