import { Request } from 'express';

export interface ProcessResponseRequest extends Request {
    payload: {
        payload: Record<string, unknown> | string;
        error: null;
        responseType?: string;
        sendRawResponse?: boolean;
        status: number;
    };
}

export interface ErrorParameterInterface {
    payload: null;
    error: Record<string, unknown> | string;
    message?: Record<string, unknown> | string;
    status: number;
}

export interface RouterRequest extends Request {
    payload: Record<string, unknown>;
}
