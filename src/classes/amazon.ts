import AWS from 'aws-sdk';
import {IAmazonClass, stringPromiseUrl, IS3Params, IS3Config } from '../interfaces/IAmazon';
import {v4} from "uuid";
import Bluebird from "bluebird"

export default class Amazon implements IAmazonClass{
	bucket: string | null;
	s3: AWS.S3;

	constructor (bucket: string, config: IS3Config = {}) {
        this.bucket = bucket
        this.s3 = new AWS.S3(config)
	}

	public getUrl: stringPromiseUrl = async (mimetype) => {
		let response: IS3Response;
		try {
			const s3Params: IS3Params = {
				Bucket: this.bucket,
				Expires: 60 * 60,
				ACL: "public-read",
			};
	        const typeFile = mimetype.split("/")[1];
			const fileName = `${v4()}.${typeFile}`;
			s3Params.Key =`temp/${fileName}`;
			s3Params.ContentType = mimetype;
			response = new Bluebird((resolve, reject) => {
				this.s3.getSignedUrl("putObject", s3Params, (err, url) => {
					if (err) return reject(new Error(err));
					return resolve({
						status: true,
						url: url,
						nameFile: fileName
					});
				});
			})
			.catch((e)=>{
				console.log(e)
				return {
				  status: false,
				  err: e.message,
				};
			});
		}
		catch(e) {
				console.log(e)
			response = {
				status: false,
				err: e.message,
			};
		}
		return response
    }

}