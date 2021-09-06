import { NextFunction } from 'express';

import Controller from '../../controllers';
import RootService from '../_root';
import { buildQuery, buildWildcardOptions } from '../../utilities/query';
import { createSchema, editSchema } from '../../validators/sample';
import {
    ServiceRequest,
    ServiceFailedResponse,
    ServiceSuccessfulResponse,
    ControllerErrorResponse,
} from '../../datatypes/customIntegrations';

export default class SampleService extends RootService {
    sampleController: Controller;

    serviceName: string;

    constructor(sampleController: Controller) {
        /** */
        super();
        this.sampleController = sampleController;
        this.serviceName = 'SampleService';
    }

    async createRecord(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { body } = request;
            const { error } = createSchema.validate(body);
            if (error) throw new Error(error as unknown as string);

            delete body.id;

            const result = await this.sampleController.createRecord({ ...body });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processSingleRead(result as Record<string, unknown>);
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] createRecord: ${e.message}`,
                    500,
                );
                next(err);
            }
        }
    }

    // async createRecords(
    //     request: ServiceRequest,
    //     next: NextFunction,
    // ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
    //     try {
    //         const { body } = request;
    //         // body is an object of multiple documents
    //         // const { error } = createSchema.validate(body);
    //         // if (error) throw new Error(error as unknown as string);

    //         const data = [];
    //         for (let i = 0; i < body.length; i++) {
    //             data.push(value);
    //         }
    //         const result: unknown = await this.sampleController.createRecords(data);

    //         if ((result as ControllerErrorResponse).failed) {
    //             throw new Error((result as ControllerErrorResponse).error);
    //         }

    //         return this.processSingleRead(result as Record<string, unknown>);
    //     } catch (e: unknown) {
    //         if (e instanceof Error) {
    //             const err = this.processFailedResponse(
    //                 `[${this.serviceName}] createRecord: ${e.message}`,
    //                 500,
    //             );
    //             next(err);
    //         }
    //     }
    // }

    async readRecordById(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.readRecords({ id, isActive: true });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }
            const response = result as Array<Record<string, unknown>>;
            return this.processSingleRead(response[0]);
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] updateRecordById: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async readRecordsByFilter(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { query } = request;

            const result = await this.handleDatabaseRead(this.sampleController, query);

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }
            return this.processMultipleReadResults(result as Record<string, unknown>);
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] readRecordsByFilter: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async readRecordsByWildcard(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { params, query } = request;

            if (!params.keys || !params.keys) {
                throw new Error('Invalid key/keyword');
            }

            const wildcardConditions = buildWildcardOptions(params.keys, params.keyword);
            const result = await this.handleDatabaseRead(
                this.sampleController,
                query,
                wildcardConditions,
            );

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processMultipleReadResults(result as Record<string, unknown>);
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] readRecordsByWildcard: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async updateRecordById(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { id } = request.params;
            const data = request.body;

            if (!id) throw new Error('Invalid ID supplied.');
            const { error } = editSchema.validate(data);
            if (error) throw new Error(error as unknown as string);

            const result = await this.sampleController.updateRecords({ id }, { ...data });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processUpdateResult(
                result as {
                    ok: number;
                    nModified: number;
                    n: number;
                },
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] updateRecordById: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async updateRecords(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { options, data } = request.body;
            const { seekConditions } = buildQuery(options as Record<string, unknown>);

            const result = await this.sampleController.updateRecords(
                { ...seekConditions },
                { ...(data as Record<string, unknown>) },
            );

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processUpdateResult({
                ...(data as Record<string, unknown>),
                ...(result as {
                    ok: number;
                    nModified: number;
                    n: number;
                }),
            });
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] updateRecords: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async softDeleteRecordById(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.softDeleteRecords({ id });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processDeleteResult(
                result as {
                    ok: number;
                    nModified: number;
                    n: number;
                },
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] deleteRecordById: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async softDeleteRecords(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options as Record<string, unknown>);

            const result = await this.sampleController.softDeleteRecords({
                ...seekConditions,
            });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processDeleteResult(
                result as {
                    ok: number;
                    nModified: number;
                    n: number;
                },
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] deleteRecords: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async hardDeleteRecordById(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { id } = request.params;
            if (!id) throw new Error('Invalid ID supplied.');

            const result = await this.sampleController.hardDeleteRecords({ id });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processDeleteResult(
                result as {
                    ok: number;
                    deletedCount: number;
                    n: number;
                },
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] hardDeleteRecordById: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }

    async hardDeleteRecords(
        request: ServiceRequest,
        next: NextFunction,
    ): Promise<ServiceSuccessfulResponse | ServiceFailedResponse | void> {
        try {
            const { options } = request.body;
            const { seekConditions } = buildQuery(options as Record<string, unknown>);

            const result = await this.sampleController.hardDeleteRecords({
                ...seekConditions,
            });

            if ((result as ControllerErrorResponse).failed) {
                throw new Error((result as ControllerErrorResponse).error);
            }

            return this.processDeleteResult(
                result as {
                    ok: number;
                    deletedCount: number;
                    n: number;
                },
            );
        } catch (e: unknown) {
            if (e instanceof Error) {
                const err = this.processFailedResponse(
                    `[${this.serviceName}] hardDeleteRecords: ${e.message}`,
                    500,
                );
                return next(err);
            }
        }
    }
}
