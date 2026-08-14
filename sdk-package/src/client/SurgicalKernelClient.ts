import type {
    OperationRequest
}
from "../contracts/OperationRequest";

import type {
    OperationResponse
}
from "../contracts/OperationResponse";


export interface OperationOptions {

    operationId?: string;

    correlationId?: string;

    idempotencyKey?: string;

}


export class SurgicalKernelClient {


    constructor(
        private endpoint:string
    ){}


    async execute(
        request:OperationRequest,
        options:OperationOptions = {}
    ):Promise<OperationResponse>{


        const headers: Record<string,string> = {

            "Content-Type":
                "application/json"

        };


        if (
            options.operationId
        ) {

            headers[
                "x-operation-id"
            ] =
                options.operationId;

        }


        if (
            options.correlationId
        ) {

            headers[
                "x-correlation-id"
            ] =
                options.correlationId;

        }


        if (
            options.idempotencyKey
        ) {

            headers[
                "idempotency-key"
            ] =
                options.idempotencyKey;

        }


        const response =
            await fetch(
                `${this.endpoint}/v1/operations`,
                {

                    method:"POST",

                    headers,

                    body:
                        JSON.stringify(
                            request
                        )

                }
            );


        return await response.json();

    }

}
