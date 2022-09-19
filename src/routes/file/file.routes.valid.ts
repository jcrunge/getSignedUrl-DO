import Joi from 'joi'

import {
    ContainerTypes,
    ValidatedRequestSchema
} from 'express-joi-validation'

export const signedSchema = Joi.object({
    mimetype: Joi.string().required(),
    folder: Joi.string().required(),
    filename: Joi.string().required(),
    bucket: Joi.string()
})

export interface signedRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        mimetype: string,
        folder: string,
        filename: string
        bucket?: string
    }
}

export const deleteSchema = Joi.object({
    folder: Joi.string().required(),
    filename: Joi.string().required(),
    bucket: Joi.string()
})

export interface deleteRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        folder: string,
        filename: string,
        bucket?: string
    }
}

export const copySchema = Joi.object({
    folder: Joi.string().required(),
    filename: Joi.string().required(),
    bucket: Joi.string(),
    from: Joi.string().required()
})

export interface copyRequestSchema extends ValidatedRequestSchema {
    [ContainerTypes.Query]: {
        folder: string,
        filename: string,
        from: string,
        bucket?: string
    }
}
