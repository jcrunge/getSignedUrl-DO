import {Request, Response, NextFunction} from "express"
import BaseController from "../controllers/BaseController";
import {authToken} from '../config/config'

export default class Middleware extends BaseController {
    constructor() {
        super()
    }

    validAuth = (req: Request, res: Response, next: NextFunction): any => {
        if(!authToken){
            return res.status(401).send('You shall not pass!')
        }
        const auth: string | undefined = req.get('authorization');
        if(!auth){
            return res.status(401).send('You shall not pass!')
        }
        if(auth !== authToken){
            return res.status(401).send('You shall not pass!')
        }
        return next();
    }
}
