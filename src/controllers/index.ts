import { model, Model } from 'mongoose';

import { ControllerErrorResponse, ControllerResponse } from '../datatypes/customIntegrations';

export default class Controller {
    model: Model<unknown>;

    constructor(modelName: string) {
        this.model = model(modelName);
    }

    static deleteRecordMetadata(record: {
        timeStamp?: number;
        createdOn?: Date;
        updatedOn?: Date;
        __v?: number;
    }): Record<string, unknown> {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { timeStamp, createdOn, updatedOn, __v, ...remainingSchema } = record;
        const response: Record<string, unknown> = { ...remainingSchema };
        return response;
    }

    static jsonize(data: unknown): unknown {
        return JSON.parse(JSON.stringify(data));
    }

    static processError(error: string): ControllerErrorResponse {
        return { failed: true, error: error };
    }

    async createRecord(data: Record<string, unknown>): ControllerResponse {
        try {
            const id = 1 + (await this.model.estimatedDocumentCount());
            const createdRecord: unknown = await this.model.create({
                id,
                ...data,
            });
            return Controller.jsonize(createdRecord) as Record<string, unknown>;
        } catch (e: unknown) {
            if (e instanceof Error) {
                return Controller.processError(`Controller createRecord: ${e.message}`);
            }
        }
    }

    async createRecords(data: Array<Record<string, unknown>>): ControllerResponse {
        try {
            const id = 1 + (await this.model.estimatedDocumentCount());
            const createdRecord = await this.model.create(data);
            const fullRecords = [];
            for (let i = 0; i < createdRecord.length; i++) {
                const newId: number = id + i;
                const recordToUpdate = createdRecord[i];
                const finalRecord: unknown = await this.model.findByIdAndUpdate(
                    recordToUpdate._id,
                    { id: newId },
                    { new: true },
                );
                fullRecords.push(finalRecord);
            }

            return { ...(Controller.jsonize(fullRecords) as []) };
        } catch (e: unknown) {
            if (e instanceof Error) {
                return Controller.processError(`Controller createRecords: ${e.message}`);
            }
        }
    }

    async readRecords(
        conditions: Record<string, unknown>,
        fieldsToReturn = '',
        sortOptions = '',
        count = false,
        skip = 0,
        limit = Number.MAX_SAFE_INTEGER,
    ): ControllerResponse {
        try {
            if (count) {
                const result = await this.model
                    .countDocuments({ ...conditions })
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptions);

                return { count: result };
            }
            const result = await this.model
                .find({ ...conditions }, fieldsToReturn)
                .skip(skip)
                .limit(limit)
                .sort(sortOptions);

            return Controller.jsonize(result);
        } catch (e: unknown) {
            if (e instanceof Error) {
                return Controller.processError(`Controller readRecords: ${e.message}`);
            }
        }
    }

    async updateRecords(
        conditions: Record<string, unknown>,
        data: Record<string, unknown>,
    ): ControllerResponse {
        try {
            const dataToSet = Controller.deleteRecordMetadata(data);
            const result = await this.model.updateMany({ ...conditions }, {
                ...dataToSet,
                $currentDate: { updatedOn: true },
            } as Record<string, unknown>);

            return Controller.jsonize({ ...result, data }) as Record<string, unknown>;
        } catch (e: unknown) {
            if (e instanceof Error) {
                return Controller.processError(`Controller updateRecords: ${e.message}`);
            }
        }
    }

    async softDeleteRecords(conditions: Record<string, unknown>): ControllerResponse {
        try {
            const result = await this.model.updateMany({ ...conditions }, {
                isActive: false,
                isDeleted: true,
                $currentDate: { updatedOn: true },
            } as Record<string, unknown>);

            return Controller.jsonize(result) as Record<string, unknown>;
        } catch (e: unknown) {
            if (e instanceof Error) {
                return Controller.processError(`Controller softDeleteRecords: ${e.message}`);
            }
        }
    }

    async hardDeleteRecords(conditions: Record<string, unknown>): ControllerResponse {
        try {
            const result = await this.model.deleteMany({ ...conditions });

            return Controller.jsonize(result) as Record<string, unknown>;
        } catch (e: unknown) {
            if (e instanceof Error) {
                return Controller.processError(`Controller hardDeleteRecords: ${e.message}`);
            }
        }
    }
}
