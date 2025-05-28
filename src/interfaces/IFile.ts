import {ControllerResponse} from '../controllers/BaseController'
import {IAmazonClass} from './IAmazon'

export type emptyPromiseResponse = () => Promise<ControllerResponse>
export type stringPromiseResponse = (s: string) => Promise<ControllerResponse>

export interface IFileClass {
	mimetype: string,
	fileData: IFileData,
	aws: IAmazonClass,
	signed: emptyPromiseResponse
	delete: emptyPromiseResponse
	copy: stringPromiseResponse
	verify: stringPromiseResponse
	deleteOld: emptyPromiseResponse
}

export interface IFileData {
	bucket?: string,
	folder: string,
	filename: string,
	lastmodified?: Date
}