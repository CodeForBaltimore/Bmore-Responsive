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
    const modelType = req.params.model_type;
    try {
        if(req.context.models.hasOwnProperty(modelType) && modelType !== 'User' && modelType !== 'UserRole'){
            //todo add filtering
            const results = await req.context.models[modelType].findAll({raw:true});

            const processedResults = await utils.processResults(results, modelType);

            if(results.length !== 0){
                message = await parseAsync(JSON.parse(JSON.stringify(processedResults)), Object.keys(results[0]), {});
            }
            code = 200;
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