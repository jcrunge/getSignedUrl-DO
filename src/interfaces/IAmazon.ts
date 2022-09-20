import {S3} from 'aws-sdk';
import {IFileData} from './IFile'

export type stringFilePromiseUrl = (m: string, fd: IFileData) => Promise<IS3Response>
export type filePromiseBooelan = (fd: IFileData) => Promise<IS3Response>
export type deleteFilesPromiseBooelan = (files: Array<IS3KeyObject>) => Promise<IS3Response>

export interface IAmazonClass {
	bucket: string | null,
	s3: any,
	getUrl: stringFilePromiseUrl,
	deleteFile: filePromiseBooelan,
	copyObject: stringFilePromiseUrl,
	listObjects: filePromiseBooelan,
	deleteObjects: deleteFilesPromiseBooelan,
}

export interface IS3KeyObject {
	Key: string
}

export interface IS3DeleteObject {
	Objects: Array<IS3KeyObject>
}

export interface IS3Params {
	Bucket: string,
	Expires?: number,
	ACL?: string,
	Key: string,
	ContentType?: string,
	CopySource?: string
}

export interface IS3Copy {
	Bucket: string,
	Key: string,
	CopySource: string
}

export interface IS3List {
	Bucket: string,
	Prefix: string
}

export interface IS3DeleteAll {
	Bucket: string,
	Delete: IS3DeleteObject
}

export interface IS3Config {
	endpoint?: string,
	region?: string,
	accessKeyId?: string,
	secretAccessKey?: string,
	signatureVersion?: string,
	apiVersion?: string
}

export interface IS3Response {
	status: boolean,
	url?: string,
	nameFile?: string,
	error?: any,
	content?: S3.ObjectList
	deleted?: S3.DeletedObjects
}


//export type IS3ResponsePromise = Promise.resolve<type>(bluebirdPromise);