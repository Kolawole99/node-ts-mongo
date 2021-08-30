import { model } from 'mongoose';

export default class Controller {
    model: any;
    constructor(modelName: string) {
        this.model = model(modelName);
    }

    static deleteRecordMetadata(record: { timeStamp?: number, createdOn?: number, updatedOn?: number, _v?:any}) {
        const { timeStamp, createdOn, updatedOn, _v, ...remainingSchema } = record;

        return remainingSchema;
    }

    static jsonize(data: {}) {
        return JSON.parse(JSON.stringify(data));
    }

    static processError(error: string | [] | {}) {
        return { ...Controller.jsonize({ failed: true, error: `Controller ${error}` }) };
    }

    async createRecord(data: {}) {
        try {
            const n = (await this.model.estimatedDocumentCount()) + 1;
            const recordToCreate = new this.model({ id: n, ...data });
            const createdRecord = await recordToCreate.save();

            return { ...Controller.jsonize(createdRecord) };
        } catch (e: any) {
            return Controller.processError(e.message);
        }
    }

    async readRecords(
        conditions: {} | [],
        fieldsToReturn = '',
        sortOptions = '',
        count = false,
        skip = 0,
        limit = Number.MAX_SAFE_INTEGER
    ) {
        try {
            let result = null;
            if (count) {
                result = await this.model
                    .countDocuments({ ...conditions })
                    .skip(skip)
                    .limit(limit)
                    .sort(sortOptions);
                return { count: result };
            }
            result = await this.model
                .find({ ...conditions }, fieldsToReturn)
                .skip(skip)
                .limit(limit)
                .sort(sortOptions);
            return Controller.jsonize([...result]);
        } catch (e: any) {
            return Controller.processError(e.message);
        }
    }

    async updateRecords(conditions: {} | [] , data: {}) {
        try {
            const dataToSet = Controller.deleteRecordMetadata(data);
            const result = await this.model.updateMany(
                { ...conditions },
                {
                    ...dataToSet,
                    $currentDate: { updatedOn: true },
                }
            );

            return Controller.jsonize({ ...result, data });
        } catch (e: any) {
            return Controller.processError(e.message);
        }
    }

    async deleteRecords(conditions: {} | [] ) {
        try {
            const result = await this.model.updateMany(
                { ...conditions },
                {
                    isActive: false,
                    isDeleted: true,
                    $currentDate: { updatedOn: true },
                }
            );

            return Controller.jsonize(result);
        } catch (e: any) {
            return Controller.processError(e.message);
        }
    }
};
