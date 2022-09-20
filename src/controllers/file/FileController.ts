import {S3} from 'aws-sdk';
import {IFileClass, emptyPromiseResponse, stringPromiseResponse, IFileData } from '../../interfaces/IFile';
import {IS3Response, IAmazonClass, IS3KeyObject} from '../../interfaces/IAmazon'
import Amazon from '../../classes/amazon';
import BaseController from '../BaseController'
import {bucketDefault} from '../../config/config';
import Bluebird from "bluebird"

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

    public list: emptyPromiseResponse = async () => {
        const listedFiles: IS3Response = await this.aws.listObjects(this.fileData);
        if(listedFiles.status){
            return this.makeResponse({
                files: listedFiles.content || []
            }, 200);
        }
        else{
            return this.makeResponse({
                error: listedFiles.error || ""
            }, 500);
        }
    }

    public deleteAll: emptyPromiseResponse = async () => {
        const listedFiles: IS3Response = await this.aws.listObjects(this.fileData);
        if(listedFiles.status){
            const files: S3.ObjectList = listedFiles.content || []
            const filesToDelete: Array<IS3KeyObject> = await Bluebird.map(files, (el) => {
                return {Key: el.Key || ""}
            })
            const deletedFiles: IS3Response = await this.aws.deleteObjects(filesToDelete)
            
            if(deletedFiles.status){
                return this.makeResponse({
                    files: deletedFiles.deleted || []
                }, 200);
            }
            return this.makeResponse({
                error: deletedFiles.error || ""
            }, 500);
        }
        else{
            return this.makeResponse({
                error: listedFiles.error || ""
            }, 500);
        }
    }

}