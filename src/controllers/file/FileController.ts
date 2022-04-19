import {IFileClass, emptyPromiseResponse } from '../../interfaces/IFile';
import {IS3Response, IAmazonClass} from '../../interfaces/IAmazon'
import Amazon from '../../classes/amazon';
import BaseController from '../BaseController'

export default class FileController extends BaseController implements IFileClass{
	mimetype: string;
    folder: string;
    filename: string;
    aws: IAmazonClass;

	constructor (mimetype: string, folder: string, filename: string) {
		super()
        this.mimetype = mimetype;
        this.folder = folder;
        this.filename = filename;
        this.aws = new Amazon("priamstorage", {signatureVersion: 'v4'});
	}

    public signed: emptyPromiseResponse = async () => {
    	const signedUrl: IS3Response = await this.aws.getUrl(this.mimetype, this.folder, this.filename);
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