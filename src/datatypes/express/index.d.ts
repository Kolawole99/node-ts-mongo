declare namespace Express {
    type ServiceSuccessfulResponse = import('../customIntegrations').ServiceSuccessfulResponse;
    type ServiceFailedResponse = import('../customIntegrations').ServiceFailedResponse;

    export interface Request {
        payload: ServiceSuccessfulResponse | ServiceFailedResponse | void;
    }
}
