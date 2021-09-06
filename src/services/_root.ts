import appEvent from '../events/_config';
import { buildQuery } from '../utilities/query';
import {
    ServiceFailedResponse,
    ServiceSuccessfulResponse,
    ControllerResponse,
    QueryBuildQueryResponse,
} from '../datatypes/customIntegrations';
import Controller from '../controllers';

export default class RootService {
    processFailedResponse(message: string, code = 400): ServiceFailedResponse {
        return {
            error: message,
            payload: null,
            status: code,
        };
    }

    processSuccessfulResponse(
        payload: Record<string, unknown>,
        code = 200,
        sendRawResponse = false,
        responseType = 'application/json',
    ): ServiceSuccessfulResponse {
        return {
            payload,
            error: null,
            responseType,
            sendRawResponse,
            status: code,
        };
    }

    async handleDatabaseRead(
        ModelController: Controller,
        queryOptions: Record<string, unknown>,
        extraOptions = {},
    ): Promise<Array<Record<string, unknown>> | ControllerResponse> {
        const buildQueryResponseObject: QueryBuildQueryResponse = buildQuery(queryOptions);
        const { count, fieldsToReturn, limit, seekConditions, skip, sortCondition } =
            buildQueryResponseObject;

        const result = await ModelController.readRecords(
            { ...seekConditions, ...extraOptions },
            fieldsToReturn,
            sortCondition,
            count || false,
            skip,
            limit,
        );

        return result;
    }

    processSingleRead(
        result: Record<string, unknown>,
    ): ServiceSuccessfulResponse | ServiceFailedResponse {
        if (result && result.id) return this.processSuccessfulResponse(result);
        return this.processFailedResponse('Resource not found', 404);
    }

    processMultipleReadResults(
        result: Record<string, unknown>,
    ): ServiceSuccessfulResponse | ServiceFailedResponse {
        const { count, ...rest } = result;
        if (result && (count || Object.keys(rest).length >= 0)) {
            return this.processSuccessfulResponse(result);
        }
        return this.processFailedResponse('Resources not found', 404);
    }

    processUpdateResult(
        result: { ok: number; nModified: number; n: number; data?: Record<string, unknown> },
        eventName?: string,
    ): ServiceSuccessfulResponse | ServiceFailedResponse {
        if (result && result.ok && result.nModified) {
            if (eventName) {
                appEvent.emit(eventName, result);
            }
            return this.processSuccessfulResponse(result);
        }
        if (result && result.ok && !result.nModified) {
            return this.processSuccessfulResponse(result, 210);
        }
        return this.processFailedResponse('Update failed', 200);
    }

    processDeleteResult(result: {
        ok: number;
        nModified?: number;
        deletedCount?: number;
        n: number;
    }): ServiceSuccessfulResponse | ServiceFailedResponse {
        if (result && result.nModified) return this.processSuccessfulResponse(result);
        return this.processFailedResponse('Deletion failed.', 200);
    }
}
