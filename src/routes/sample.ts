const router = require('express').Router();
import { Response, NextFunction } from 'express';

import Controller from '../controllers/index';
import sampleSchemaValidator from '../validators/sample';
import SampleService from '../services/sample/sample';
import { routerRequest } from '../datatypes/customIntegrations';

const modelName = "Sample"
const sampleController = new Controller(modelName);
const sampleService = new SampleService(sampleController, sampleSchemaValidator);

try {
    router
        .post('/', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.createRecord(request, next);
            next();
        })
        .get('/', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.readRecordsByFilter(request, next);
            next();
        })
        .get('/:id', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.readRecordById(request, next);
            next();
        })
        .get('/search/:keys/:keyword', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.readRecordsByWildcard(request, next);
            next();
        })
        .put('/', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.updateRecords(request, next);
            next();
        })
        .put('/:id', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.updateRecordById(request, next);
            next();
        })
        .delete('/', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.deleteRecords(request, next);
            next();
        })
        .delete('/:id', async (request: routerRequest, response: Response, next: NextFunction) => {
            request.payload = await sampleService.deleteRecordById(request, next);
            next();
        });
} catch (e: any) {
    console.log(`[${modelName}] Route Error: ${e.message}`);
}

export default router;
