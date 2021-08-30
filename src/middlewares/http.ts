import { Request, Response, NextFunction } from 'express';

import { processResponseRequest, errorParameterInterface } from '../datatypes/customIntegrations'
import { Logger } from '../utilities/logger';

export function setupRequest(request: Request, response: Response, next: NextFunction) {
    request.headers['access-control-allow-origin'] = '*';
    request.headers['access-control-allow-headers'] = '*';

    if (request.method === 'OPTIONS') {
        request.headers['access-control-allow-methods'] = 'GET, POST, PUT, PATCH, DELETE';
        response.status(200).json();
    }

    next();
}

export function processResponse(request: processResponseRequest, response: Response, next: NextFunction) {
    if (!request.payload) return next();
    const { status } = request.payload;
    return response.status(status).json(request.payload);
}

export function handle404(request: Request, response: Response, next: NextFunction) {
    const returnData = {
        status: 404,
        error: 'Resource not found',
        payload: null,
    };

    next(returnData);
}

export function handleError(error: errorParameterInterface, request: Request, response: Response, next: NextFunction) {
    Logger.error(error.error || error.message);

    return response.status(error.status || 500).json({
        status: error.status || 500,
        error: error.error || 'Internal Server Error',
        payload: null,
    });
}
