import { Router } from 'express';
import validator from 'validator';
import utils from '../utils';
import { parseAsync } from "json2csv";

const router = new Router();
router.use(utils.authMiddleware)

// Gets a data dump from the passed in model (if it exists).
router.get('/:model_type', async (req, res) => {
    let code;
    let message;
    try {
        if(req.context.models.hasOwnProperty(req.params.model_type)){
            const results = await req.context.models[req.params.model_type].findAll({raw:true});

            if(results.length !== 0){
                code = 200;
                message = await parseAsync(JSON.parse(JSON.stringify(results)), Object.keys(results[0]), {});
            } else {
                code = 404;
                message = "no data found for model type"
            }
        } else {
            message = "model type is invalid"
            code = 422;
        }
    } catch (e) {
        console.error(e);
        code = 500;
    }

    return utils.response(res, code, message);
});

export default router;