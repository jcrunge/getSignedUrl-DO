import {S3} from 'aws-sdk';
import {
	IS3Config,
	IS3Params,
	IS3Response,
	IAmazonClass, 
	filePromiseBooelan,
	stringFilePromiseUrl
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
}