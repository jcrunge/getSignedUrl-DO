import { Router, Request, Response } from "express"
import FileController from '../../controllers/file/FileController'
import {ControllerResponse} from '../../controllers/BaseController'
import {IFileData} from '../../interfaces/IFile'

import {
    ValidatedRequest,
    createValidator,
} from 'express-joi-validation'

import {
    signedSchema,
    signedRequestSchema,
    deleteSchema,
    deleteRequestSchema,
    copySchema,
    copyRequestSchema,
    listSchema,
    listRequestSchema
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
    const {mimetype, folder, filename}  = req.query;
    const bucket: string | null = req.query.bucket? req.query.bucket : null;
    const fileData: IFileData = {
        folder: folder,
        filename: filename
    }
    if(bucket) fileData.bucket = bucket
    const fileObject = new FileController(fileData, mimetype)
    const signedUrl: ControllerResponse = await fileObject.signed()
    return res.json(signedUrl.body).status(signedUrl.status)
});

fileRouter.delete('/delete', auth.validAuth, validator.query(deleteSchema), async (req: ValidatedRequest<deleteRequestSchema>, res: Response) => {
    const {folder, filename}  = req.query;
    const bucket: string | null = req.query.bucket? req.query.bucket : null;
    const fileData: IFileData = {
        folder: folder,
        filename: filename
    }
    if(bucket) fileData.bucket = bucket
    const fileObject = new FileController(fileData)
    const deletedFile: ControllerResponse = await fileObject.delete()
    return res.json(deletedFile.body).status(deletedFile.status)
});

fileRouter.get('/copy', auth.validAuth, validator.query(copySchema), async (req: ValidatedRequest<copyRequestSchema>, res: Response) => {
    const {folder, filename, from}  = req.query;
    const bucket: string | null = req.query.bucket? req.query.bucket : null;
    const fileData: IFileData = {
        folder: folder,
        filename: filename
    }
    if(bucket) fileData.bucket = bucket
    const fileObject = new FileController(fileData)
    const copiedFile: ControllerResponse = await fileObject.copy(from)
    return res.json(copiedFile.body).status(copiedFile.status)
});

fileRouter.get('/list', auth.validAuth, validator.query(listSchema), async (req: ValidatedRequest<listRequestSchema>, res: Response) => {
    const {folder}  = req.query;
    const bucket: string | null = req.query.bucket? req.query.bucket : null;
    const fileData: IFileData = {
        folder: folder,
        filename: "*"
    }
    if(bucket) fileData.bucket = bucket
    const fileObject = new FileController(fileData)
    const listedFiles: ControllerResponse = await fileObject.list()
    return res.json(listedFiles.body).status(listedFiles.status)
});

fileRouter.delete('/deleteAll', auth.validAuth, validator.query(listSchema), async (req: ValidatedRequest<listRequestSchema>, res: Response) => {
    const {folder}  = req.query;
    const bucket: string | null = req.query.bucket? req.query.bucket : null;
    const fileData: IFileData = {
        folder: folder,
        filename: "*"
    }
    if(bucket) fileData.bucket = bucket
    const fileObject = new FileController(fileData)
    const deletedFiles: ControllerResponse = await fileObject.deleteAll()
    return res.json(deletedFiles.body).status(deletedFiles.status)
});


export default fileRouter
