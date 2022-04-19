import AWS from 'aws-sdk';
import {IAmazonClass, stringPromiseUrl, IS3Params, IS3Config, IS3Response } from '../interfaces/IAmazon';
import Bluebird from "bluebird"

export default class Amazon implements IAmazonClass{
	bucket: string | null;
	s3: AWS.S3;

	constructor (bucket: string, config: IS3Config = {}) {
        this.bucket = bucket
        this.s3 = new AWS.S3(config)
	}

	public getUrl: stringPromiseUrl = async (mimetype: string, folder: string, filename: string) => {
		let response: IS3Response
		try {
			const s3Params: IS3Params = {
				Bucket: this.bucket,
				Expires: 60 * 60,
				ACL: "public-read",
				Key: `${folder}/${filename}`,
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
						nameFile: filename
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