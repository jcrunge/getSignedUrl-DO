import {ControllerResponse} from '../controllers/BaseController'
import {IAmazonClass} from './IAmazon'

export type emptyPromiseResponse = () => Promise<ControllerResponse>

export interface IFileClass {
	mimetype: string | null,
	aws: IAmazonClass,
	signed: emptyPromiseResponse
}