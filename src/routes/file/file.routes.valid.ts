import Joi from 'joi'

import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export const signedSchema = Joi.object({
    mimetype: Joi.string().required(),
    folder: Joi.string().required(),
    filename: Joi.string().required(),
})

export interface signedRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        mimetype: string,
        folder: string,
        filename: string
    }
}
