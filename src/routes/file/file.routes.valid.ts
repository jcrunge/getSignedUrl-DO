import Joi from 'joi'

import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export const signedSchema = Joi.object({
    mimetype: Joi.string().required(),
    bucket: Joi.string()
})

export interface signedRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        mimetype: string,
        bucket?: string
    }
}
