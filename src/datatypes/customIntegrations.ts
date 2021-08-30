import { Request } from "express"

export interface processResponseRequest extends Request {
    payload: {
        payload: {} | string,
        error: null,
        responseType?: string,
        sendRawResponse?: boolean,
        status: number
    }
}

export interface errorParameterInterface {
    payload: null,
    error: {} | string,
    message?: {} | string,
    status: number
}

export interface routerRequest extends Request {
    payload: {}
}
