import { Request } from 'express';

export interface MiddlewareErrorParameterInterface {
    payload: null;
    error: Record<string, unknown>;
    message?: Record<string, unknown>;
    status: number;
}

export interface ServiceRequest extends Request {
    body: Record<string, unknown>;
}

export interface ServiceSuccessfulResponse {
    payload: Record<string, unknown>;
    error: null;
    responseType: string;
    sendRawResponse: boolean;
    status: number;
}

export interface ServiceFailedResponse {
    payload: null;
    error: Record<string, unknown> | string;
    status: number;
}

export interface ControllerErrorResponse {
    failed: boolean;
    error: string;
}

export type ControllerResponse = Promise<ControllerErrorResponse | unknown>;
