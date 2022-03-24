//import {} from 'aws-sdk'

export type stringPromiseUrl = (s: string) => Promise<IS3Response>

export interface IAmazonClass {
	bucket: string,
	s3: any,
	getUrl: stringPromiseString
}

export interface IS3Params {
	Bucket: string,
	Expires: number,
	ACL: string,
	Key?: string,
	ContentType?: string
}

export interface IS3Config {
	endpoint?: string,
	region?: string,
	accessKeyId?: string,
	secretAccessKey?: string,
	signatureVersion?: string
}

export interface IS3Response {
	status: boolean,
	url?: string,
	nameFile?: string,
	error?: string
}