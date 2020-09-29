import {Router} from 'express'
import utils from '../utils'
import {parseAsync} from 'json2csv'
import {Op} from 'sequelize'

const router = new Router()
router.use(utils.authMiddleware)

// Gets a data dump from the passed in model (if it exists).
router.get('/:model_type', async (req, res) => {

  const response = new utils.Response()
  const modelType = req.params.model_type

  try {

    if (!process.env.BYPASS_LOGIN) {
      const e = await utils.loadCasbin()
      const roles = await e.getRolesForUser(req.context.me.email)

      if (!roles.includes('admin')) {
        response.setCode(400)
        response.setMessage('User is not authorized to perform this action.')
        return res.status(response.getCode()).send(response.getMessage())
      }
    }

    /** @todo refactor this when we change how CSV's are delivered. */
    // eslint-disable-next-line no-prototype-builtins
    if (req.context.models.hasOwnProperty(modelType) && modelType !== 'User' && modelType !== 'UserRole') {
      let options = {raw: true}
      // search by name if filter query param is included
      if (req.query && req.query.filter && req.query.filter.length) {
        options.where = {
          name: {
            [Op.iLike]: '%' + req.query.filter + '%'
          }
        }
      }

      /** @todo add a search filter for status once data has a status field. */
      let results = await req.context.models[modelType].findAll(options)

      if (results.length !== 0) {
        const processedResults = await utils.processResults(results, modelType)
        const fields = Object.keys(results[0])
        parseAsync(processedResults, {fields}).then(csv => {
          response.setMessage(csv)
          const dateObj = new Date()
          const dateStr = `${dateObj.getUTCMonth() + 1}_${dateObj.getUTCDate()}_${dateObj.getUTCFullYear()}`
          res.setHeader('Content-disposition', `attachment; filename=HCRC_${modelType}_${dateStr}.csv`)
          res.set('Content-Type', 'text/csv')
          return res.status(response.getCode()).send(response.getMessage())
        }, err => {
          response.setCode(400)
          response.setMessage('Not able to parse data: ' + err)
          return res.status(response.getCode()).send(response.getMessage())
        })
      } else {
        response.setCode(200)
        response.setMessage('No results found')
        return res.status(response.getCode()).send(response.getMessage())
      }
    } else {
      response.setCode(400)
      response.setMessage('Model type is invalid')
      return res.status(response.getCode()).send(response.getMessage())
    }
  } catch (e) {
    console.error(e)
    response.setCode(500)
    return res.status(response.getCode()).send(response.getMessage())
  }
})

export default router
