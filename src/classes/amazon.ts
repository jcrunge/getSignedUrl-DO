import {S3} from 'aws-sdk';
import {
	IS3Config,
	IS3Params,
	IS3Copy,
	IS3List,
	IS3DeleteAll,
	IS3Response,
	IS3KeyObject,
	IAmazonClass, 
	filePromiseBooelan,
	stringFilePromiseUrl,
	stringPromiseUrl,
	deleteFilesPromiseBooelan
} from '../interfaces/IAmazon';
import {IFileData} from '../interfaces/IFile'
import Bluebird from "bluebird"

export default class Amazon implements IAmazonClass{
	bucket: string;
	s3: S3;

	constructor (bucket: string, config: IS3Config = {}) {
        this.bucket = bucket
        this.s3 = new S3(config)
	}

	public getUrl: stringFilePromiseUrl = async (mimetype: string, fileData: IFileData) => {
		let response: IS3Response
		try {
			const s3Params: IS3Params = {
				Bucket: this.bucket,
				Expires: 60 * 60,
				ACL: "public-read",
				Key: `${fileData.folder}/${fileData.filename}`,
				ContentType: mimetype
			};
			response = await Promise.resolve<IS3Response>(new Bluebird((resolve, reject) => {
				return this.s3.getSignedUrl("putObject", s3Params, (err, url) => {
					let resp: IS3Response;
					if (err) {
						resp = {
							status: false,
					  		error: err.message,
						}
						return reject(resp);
					}
					resp = {
						status: true,
						url: url,
						nameFile: fileData.filename
					}
					return resolve(resp);
				});
			})
			.catch((e)=>{
				return {
				  status: false,
				  error: e,
				};
			}))
		}
		catch(e) {
			response = {
				status: false,
				error: e,
			};
		}
		return response
    }

    public deleteFile: filePromiseBooelan = async (fileData: IFileData) => {
    	let response: IS3Response
    	try {
			const s3Params: IS3Params = {
				Bucket: this.bucket,
				Key: `${fileData.folder}/${fileData.filename}`,
			};
			response = await Promise.resolve<IS3Response>(new Bluebird((resolve, reject) => {
				return this.s3.deleteObject(s3Params, (err) => {
					let resp: IS3Response;
					if (err) {
						resp = {
							status: false,
					  		error: err.message,
						}
						return reject(resp);
					}
					resp = {
						status: true,
						nameFile: fileData.filename
					}
					return resolve(resp);
				});
			})
			.catch((e)=>{
				return {
				  status: false,
				  error: e,
				};
			}))
		}
		catch(e) {
			response = {
				status: false,
				error: e,
			};
		}
		return response
    }

    public copyObject: stringFilePromiseUrl = async (from: string, fileData: IFileData) => {
    	let response: IS3Response
    	try {
			const s3Params: IS3Copy = {
				Bucket: this.bucket,
				Key: `${fileData.folder}/${fileData.filename}`,
				CopySource: from
			};
			response = await Promise.resolve<IS3Response>(new Bluebird((resolve, reject) => {
				return this.s3.copyObject(s3Params, (err) => {
					let resp: IS3Response;
					if (err) {
						resp = {
							status: false,
					  		error: err.message,
						}
						return reject(resp);
					}
					resp = {
						status: true,
						nameFile: fileData.filename
					}
					return resolve(resp);
				});
			})
			.catch((e)=>{
				return {
				  status: false,
				  error: e,
				};
			}))
		}
		catch(e) {
			response = {
				status: false,
				error: e,
			};
		}
		return response
    }

    public listObjects: filePromiseBooelan = async (fileData: IFileData) => {
    	let response: IS3Response
    	try {
			const s3Params: IS3List = {
				Bucket: this.bucket,
				Prefix: `${fileData.folder}/`
			};
			response = await Promise.resolve<IS3Response>(new Bluebird((resolve, reject) => {
				return this.s3.listObjectsV2(s3Params, (err, data) => {
					let resp: IS3Response;
					if (err) {
						resp = {
							status: false,
					  		error: err.message,
						}
						return reject(resp);
					}
					resp = {
						status: true,
						content: data.Contents
					}
					return resolve(resp);
				});
			})
			.catch((e)=>{
				return {
				  status: false,
				  error: e,
				};
			}))
		}
		catch(e) {
			response = {
				status: false,
				error: e,
			};
		}
		return response
    }

    public deleteObjects: deleteFilesPromiseBooelan = async (files: Array<IS3KeyObject>) => {
    	let response: IS3Response
    	try {
			const s3Params: IS3DeleteAll = {
				Bucket: this.bucket,
				Delete: {Objects: files}
			};
			response = await Promise.resolve<IS3Response>(new Bluebird((resolve, reject) => {
				return this.s3.deleteObjects(s3Params, (err, data) => {
					let resp: IS3Response;
					if (err) {
						resp = {
							status: false,
					  		error: err.message,
						}
						return reject(resp);
					}
					resp = {
						status: true,
						deleted: data.Deleted
					}
					return resolve(resp);
				});
			})
			.catch((e)=>{
				return {
				  status: false,
				  error: e,
				};
			}))
		}
		catch(e) {
			response = {
				status: false,
				error: e,
			};
		}
		return response
    }

    public headObject: stringPromiseUrl = async (route: string) => {
    	let response: IS3Response
    	try {
			const s3Params: IS3Params = {
				Bucket: this.bucket,
				Key: route
			};
			response = await Promise.resolve<IS3Response>(new Bluebird((resolve, reject) => {
				return this.s3.headObject(s3Params, (err) => {
					let resp: IS3Response;
					if (err) {
						resp = {
							status: false,
					  		error: err.message,
						}
						return reject(resp);
					}
					resp = {
						status: true,
						nameFile: route
					}
					return resolve(resp);
				});
			})
			.catch((e)=>{
				return {
				  status: false,
				  error: e,
				};
			}))
		}
		catch(e) {
			response = {
				status: false,
				error: e,
			};
		}
		return response
    }
}