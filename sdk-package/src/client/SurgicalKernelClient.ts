import type {
    ExecutionRequest
}
from "../contracts/ExecutionRequest";


import type {
    ExecutionResponse
}
from "../contracts/ExecutionResponse";


export class SurgicalKernelClient {


    constructor(
        private endpoint:string
    ){}



    async execute(
        request:ExecutionRequest
    ):Promise<ExecutionResponse>{


        const response =
        await fetch(
            `${this.endpoint}/execute`,
            {

                method:"POST",

                headers:{
                    "Content-Type":
                    "application/json"
                },

                body:
                JSON.stringify(request)

            }
        );


        return await response.json();

    }

}
