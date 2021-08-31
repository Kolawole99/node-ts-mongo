import { Request } from 'express';

export interface ProcessResponseRequest extends Request {
    payload: {
        payload: Record<string, unknown>;
        error: null;
        responseType?: string;
        sendRawResponse?: boolean;
        status: number;
    };
}

export interface ErrorParameterInterface {
    payload: null;
    error: Record<string, unknown>;
    message?: Record<string, unknown>;
    status: number;
}

export interface RouterRequest extends Request {
    payload: Record<string, unknown>;
}
