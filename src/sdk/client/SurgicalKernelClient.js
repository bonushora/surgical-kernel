import { ExecutionRequest }
from "../contracts/executionRequest.js";


import { ExecutionResponse }
from "../contracts/executionResponse.js";


export class SurgicalKernelClient {


    constructor(kernel){

        this.kernel = kernel;

    }



    async execute(payload){


        const request =
        new ExecutionRequest(payload);


        const response =
        await this.kernel.execute(request);



        return new ExecutionResponse(response);

    }


}
