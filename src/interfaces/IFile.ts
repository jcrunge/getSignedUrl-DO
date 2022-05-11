import {ControllerResponse} from '../controllers/BaseController'
import {IAmazonClass} from './IAmazon'

export type emptyPromiseResponse = () => Promise<ControllerResponse>

export interface IFileClass {
	mimetype: string,
	fileData: IFileData,
	aws: IAmazonClass,
	signed: emptyPromiseResponse
	delete: emptyPromiseResponse
}

export interface IFileData {
	bucket?: string,
	folder: string,
	filename: string
}