/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router, Request, Response, NextFunction } from 'express';

import Controller from '../controllers/index';
import SampleService from '../services/sample/sample';

const router = Router();
const modelName = 'Sample';
const sampleController = new Controller(modelName);
const sampleService = new SampleService(sampleController);

try {
    router
        .post(
            '/',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.createRecord(request, next);
                next();
            },
        )
        .get(
            '/',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.readRecordsByFilter(request, next);
                next();
            },
        )
        .get(
            '/:id',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.readRecordById(request, next);
                next();
            },
        )
        .get(
            '/search/:keys/:keyword',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.readRecordsByWildcard(request, next);
                next();
            },
        )
        .put(
            '/',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.updateRecords(request, next);
                next();
            },
        )
        .put(
            '/:id',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.updateRecordById(request, next);
                next();
            },
        )
        .delete(
            '/soft-delete',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.softDeleteRecords(request, next);
                next();
            },
        )
        .delete(
            '/soft-delete/:id',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.softDeleteRecordById(request, next);
                next();
            },
        )
        .delete(
            '/hard-delete',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.hardDeleteRecords(request, next);
                next();
            },
        )
        .delete(
            '/hard-delete/:id',
            async (request: Request, response: Response, next: NextFunction): Promise<void> => {
                request.payload = await sampleService.hardDeleteRecordById(request, next);
                next();
            },
        );
} catch (e: unknown) {
    if (e instanceof Error) {
        console.log(`[${modelName}] Route Error: ${e.message}`);
    }
}

export default router;
