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
        this.aws = new Amazon(fileData.bucket || bucketDefault, {
            signatureVersion: 'v4',
            useAccelerateEndpoint: true
        });
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

    // delete files older than 1 month
    public deleteOld: emptyPromiseResponse = async () => {
        const listedFiles: IS3Response = await this.aws.listObjects(this.fileData);

        if(listedFiles.status){
            const files: S3.ObjectList = listedFiles.content || [];
            return this.makeResponse({
                message: "Delete old method not fully implemented",
                fileCount: files.length
            }, 200);
        }
        else{
            return this.makeResponse({
                error: listedFiles.error || ""
            }, 500);
        }
    }

    public verify: stringPromiseResponse = async (route: string) => {
        try {
            const exists: IS3Response = await this.aws.headObject(route);
            if(exists.status){
                return this.makeResponse({
                    exists: true
                }, 200);
            }
            else{
                return this.makeResponse({
                    exists: false
                }, 404);
            }
        } catch (error) {
            return this.makeResponse({
                exists: false,
                error: error.message || "File verification failed"
            }, 404);
        }
    }

    public deleteOldFiles: emptyPromiseResponse = async () => {
        const listedFiles: IS3Response = await this.aws.listObjects(this.fileData);
        
        if(listedFiles.status){
            const files: S3.ObjectList = listedFiles.content || [];
            const cutoffDate = this.fileData.lastmodified || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
            
            const filesToDelete: Array<IS3KeyObject> = files
                .filter(file => file.LastModified && file.LastModified < cutoffDate)
                .map(file => ({Key: file.Key || ""}));
            
            if(filesToDelete.length === 0) {
                return this.makeResponse({
                    message: "No old files to delete",
                    deletedCount: 0
                }, 200);
            }
            
            const deletedFiles: IS3Response = await this.aws.deleteObjects(filesToDelete);
            
            if(deletedFiles.status){
                return this.makeResponse({
                    files: deletedFiles.deleted || [],
                    deletedCount: filesToDelete.length
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