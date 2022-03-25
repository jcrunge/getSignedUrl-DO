import {IFileClass, emptyPromiseResponse } from '../../interfaces/IFile';
import {IS3Response, IAmazonClass} from '../../interfaces/IAmazon'
import Amazon from '../../classes/amazon';
import BaseController from '../BaseController'
import {bucketDefault} from '../../config/config';

export default class FileController extends BaseController implements IFileClass{
	mimetype: string | null;
    aws: IAmazonClass;

	constructor (mimetype: string | null, bucket: string | null) {
		super()
        this.mimetype = mimetype;
        this.aws = new Amazon(bucket || bucketDefault, {signatureVersion: 'v4', apiVersion: '2006-03-01'});
	}

    public signed: emptyPromiseResponse = async () => {
    	const signedUrl: IS3Response = await this.aws.getUrl(this.mimetype);
        if(signedUrl.status){
            return this.makeResponse({
                url: signedUrl.url || "", 
                name: signedUrl.nameFile || ""
            }, 200);
        }
        else{
            return this.makeResponse({
                error: signedUrl.error || ""
            }, 500);
        }
        
    }

}