export interface customError {
    field?: any, 
    message?: string
}
export interface ControllerResponse {
    body: IBody,
    status: number,
    data?: any,
    Success?: boolean
}
export interface IBody {
    [key: string]: any,
    errors?: customError[]
    info?:{
        controller?: string,
        scope?: string
    }
}

export interface Info {
    controller?: string,
    scope?: string,
    extra?: string
}

export default abstract class BaseController{

    makeResponse( body : IBody, status : number, success : boolean =  true, data : any = {}): ControllerResponse {

        let response: ControllerResponse = {
            body : body,
            status : status,
            data : data,
            Success : success
        };

        return response
    }

}
