import { Router, Request, Response } from "express"
import FileController from '../../controllers/file/FileController'
import {ControllerResponse} from '../../controllers/BaseController'

import {
    ValidatedRequest,
    createValidator,
} from 'express-joi-validation'

import {
    signedSchema,
    signedRequestSchema,
} from "./file.routes.valid";

import Middleware from "../../middleware/middleware";

const fileRouter = Router()
const validator = createValidator({
    passError: true
})
const auth = new Middleware();

/**
 *  File Routes
 */
fileRouter.get('/', (_: Request, res: Response) => {
    return res.send(true)
})

fileRouter.get('/signed', auth.validAuth, validator.query(signedSchema), async (req: ValidatedRequest<signedRequestSchema>, res: Response) => {
    const {mimetype}  = req.query;
    const bucket: string | null = req.query.bucket? req.query.bucket : null
    const fileObject = new FileController(mimetype, bucket)
    const signedUrl: ControllerResponse = await fileObject.signed()
    return res.json(signedUrl.body).status(signedUrl.status)
});


export default fileRouter
