import { Router, Request, Response } from 'express'
import fileRouter from './file/file.routes'

/**
 * App routes Variables
 */
const routes = Router()

/**
 * App routes
 */

routes.get('/', (_: Request, res: Response) => {
    res.send("Hi!")
})
routes.use(`/api/file`, fileRouter)

export default routes