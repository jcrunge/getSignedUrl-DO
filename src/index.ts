import * as dotenv from 'dotenv'
import express from 'express'
import cors from "cors"
import routes from './routes'
import helmet from "helmet"
import {ExpressJoiError } from 'express-joi-validation'
import {PORT} from './config/config'

dotenv.config()

if (!PORT) {
    process.exit(1)
}

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(routes)

interface Context {
    [key: string]: any;
    key?: string;
    label?: string;
    value?: any;
}

interface ValidationErrorItem {
    message: string;
    path: Array<string | number>;
    type: string;
    context?: Context;
}

app.use((err: any|ExpressJoiError, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err && err.error && err.error.isJoi) {
        let allErrors : any = {}
        typeof err.error.details;
        let detailedError: ValidationErrorItem[] = err.error ? err.error.details : [];
        detailedError.forEach( (val) => {
            let errorDetail : ValidationErrorItem = val;
            let key:string = "";
            key = errorDetail.context && errorDetail.context.key ? errorDetail.context.key : key
            allErrors[key] = errorDetail.message;
        })
        //console.log(allErrors);
        res.status(400).json({
            errors: allErrors
        })
    } else {
        next(err);
    }
})

export const server = app.listen(PORT, function() {
    console.log(`app listening in port ${PORT}!`);
});


export default app