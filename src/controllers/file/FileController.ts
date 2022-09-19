import {IFileClass, emptyPromiseResponse, stringPromiseResponse, IFileData } from '../../interfaces/IFile';
import {IS3Response, IAmazonClass} from '../../interfaces/IAmazon'
import Amazon from '../../classes/amazon';
import BaseController from '../BaseController'
import {bucketDefault} from '../../config/config';

export default class FileController extends BaseController implements IFileClass{
	mimetype: string;
    fileData: IFileData;
    aws: IAmazonClass;

	constructor (fileData: IFileData, mimetype: string = "text/plain") {
		super()
        this.mimetype = mimetype;
        this.fileData = fileData;
        this.aws = new Amazon(fileData.bucket || bucketDefault, {signatureVersion: 'v4'});
	}

    public signed: emptyPromiseResponse = async () => {
        const signedUrl: IS3Response = await this.aws.getUrl(this.mimetype, this.fileData);
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

    public delete: emptyPromiseResponse = async () => {
        const deletedFile: IS3Response = await this.aws.deleteFile(this.fileData);
        if(deletedFile.status){
            return this.makeResponse({
                name: deletedFile.nameFile || ""
            }, 200);
        }
        else{
            return this.makeResponse({
                error: deletedFile.error || ""
            }, 500);
        }
        
    }

    public copy: stringPromiseResponse = async (from: string) => {
        const copiedfile: IS3Response = await this.aws.copyObject(from, this.fileData);
        if(copiedfile.status){
            return this.makeResponse({
                name: copiedfile.nameFile || ""
            }, 200);
        }
        else{
            return this.makeResponse({
                error: copiedfile.error || ""
            }, 500);
        }
    }

}