import supertest from 'supertest'
import app from '../../src/index';
import { server } from '../../src';
import axios from 'axios'
import fs from 'fs'
//mport path from 'path'
import {authToken} from '../../src/config/config'

const api = supertest(app);

let url: string = "";
describe('signed url', () => {
    

    test('if signed url is sucesfully created', async () => {
        const resp = await api.get('/api/file/signed?mimetype=image/png').set({ Authorization: authToken }).send();
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
});

server.close();