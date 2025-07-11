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
    listRequestSchema,
    verifySchema,
    verifyRequestSchema
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

fileRouter.get('/verify', auth.validAuth, validator.query(verifySchema), async (req: ValidatedRequest<verifyRequestSchema>, res: Response) => {
    const {folder}  = req.query;
    console.log('Folder: ', folder);
    const bucket: string | null = req.query.bucket? req.query.bucket : null;
    // Use route parameter if provided, otherwise use folder as the full path
    let route: string = req.query.route as string || '';
    if (!route && folder) {
        route = folder;
    }
        
    const fileData: IFileData = {
        folder: folder || "",
        filename: "*"
    }
    if(bucket) fileData.bucket = bucket
    const fileObject = new FileController(fileData)
    const verifyResult: ControllerResponse = await fileObject.verify(route)
    return res.status(verifyResult.status).send()
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

fileRouter.delete('/deleteOld', auth.validAuth, async (req, res) => {
    const { folder, bucket } = req.query;

    const fileData = { 
        folder: folder as string, 
        bucket: bucket as string,
        filename: "*",
        lastmodified: new Date(new Date().setDate(new Date().getDate() - 1))
    };

    const fileController = new FileController(fileData);

    const response = await fileController.deleteOldFiles();
    
    return res.status(response.status).json(response.body);
});

export default fileRouter
