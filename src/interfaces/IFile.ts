import {ControllerResponse} from '../controllers/BaseController'
import {IS3Response, IAmazonClass} from './IAmazon'

export type emptyPromiseResponse = () => Promise<ControllerResponse>

export interface IFileClass {
	mimetype: string,
	aws: IAmazonClass,
	signed: emptyPromiseResponse
}