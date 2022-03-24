import * as dotenv from 'dotenv'

dotenv.config()

interface AmazonCredentials {
    client_id: string,
    client_secret: string,
    region: string
}

/**
* App environment Variables
*/

export const environment: string = process.env.NODE_ENV ? process.env.NODE_ENV as string : "development"

export const __prod__: boolean = environment === "production"

export const PORT: number = __prod__ ? parseInt(process.env.PORT as string, 10) : 8080

export const AWSCredentials: AmazonCredentials = {
    client_id: process.env.AWS_ACCESS_KEY_ID ? process.env.AWS_ACCESS_KEY_ID as string : '',
    client_secret: process.env.AWS_SECRET_ACCESS_KEY ? process.env.AWS_SECRET_ACCESS_KEY as string : '',
    region: process.env.AWS_REGION ? process.env.AWS_REGION as string : ''
};

export const authToken: string = process.env.AUTH_TOKEN ? process.env.AUTH_TOKEN as string : '';

export const errorManagement: boolean = process.env.ERROR_MANAGEMENT === 'true' ? true : false