import supertest from 'supertest'
import app from '../../src/index';
import { server } from '../../src';
import axios from 'axios'
import fs from 'fs'
import {v4} from "uuid";
//mport path from 'path'
import {authToken} from '../../src/config/config'

const api = supertest(app);
const filename:string = `${v4()}.png`
const bucket:string = 'priamdev'

let url: string = "";
describe('signed url', () => {

    test('if signed url is sucesfully created', async () => {
        const resp = await api.get('/api/file/signed')
        .query({
            mimetype: 'image/png',
            folder: 'testfolder',
            filename: filename,
            bucket: bucket
        })
        .set({ Authorization: authToken }).send();
        if(resp.body.url){
            url = resp.body.url
        }
        expect(resp.body).toHaveProperty("url");
    })

    test('if signed url is working', async () => {
        const uploadFile = await fs.readFileSync(__dirname + '/meh.png');
        const resp = await axios.put(url, {
            data: uploadFile,
        }, {
            headers: {
                'Content-Type': 'image/png',
                'x-amz-acl': 'public-read'
            }
        }).then((response) => {
            return response.status
        })
        expect(resp).toBe(200);
    })

    test('if file is successfully copied', async () => {
        const resp = await api.get('/api/file/copy')
        .query({
            folder: 'testfolder',
            filename: "copy_"+ filename,
            from: bucket + '/testfolder/' + filename,
            bucket: bucket
        })
        .set({ Authorization: authToken }).send();
        expect(resp.body).toHaveProperty("name");
    })

    test('if file is successfully deleted', async () => {
        const resp = await api.delete('/api/file/delete')
        .query({
            folder: 'testfolder',
            filename: filename,
            bucket: bucket
        })
        .set({ Authorization: authToken }).send();
        expect(resp.body).toHaveProperty("name");
    })

    test('if all files in folder are successfully listed', async () => {
        const resp = await api.get('/api/file/list')
        .query({
            folder: 'testfolder',
            bucket: bucket
        })
        .set({ Authorization: authToken }).send();
        expect(resp.body).toHaveProperty("files");
        const content = resp.body.files || []
        expect(content.length).toBeGreaterThan(0)
    })

    test('if all files in folder are successfully deleted', async () => {
        const resp = await api.delete('/api/file/deleteAll')
        .query({
            folder: 'testfolder',
            bucket: bucket
        })
        .set({ Authorization: authToken }).send();
        expect(resp.body).toHaveProperty("files");
        const deleted = resp.body.files || []
        expect(deleted.length).toBeGreaterThan(0)
    })
});

server.close();