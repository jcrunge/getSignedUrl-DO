//import {} from 'aws-sdk'

export type stringPromiseUrl = (m: string, f: string, n: string) => Promise<IS3Response>

export interface IAmazonClass {
	bucket: string | null,
	s3: any,
	getUrl: stringPromiseUrl
}

export interface IS3Params {
	Bucket: string | null,
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
	signatureVersion?: string,
	apiVersion?: string
}

export interface IS3Response {
	status: boolean,
	url?: string,
	nameFile?: string,
	error?: any
}

//export type IS3ResponsePromise = Promise.resolve<type>(bluebirdPromise);