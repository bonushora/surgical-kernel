import { SurgicalKernelClient }
from "../../src/sdk/client/SurgicalKernelClient.js";


const mockKernel = {


    async execute(request){

        return {

            result:"ok",

            decision:"ALLOW",

            risk:{
                score:0
            },

            audit:{
                enabled:true
            },

            snapshot:{
                version:"BH-SDP-v1"
            },

            replay:{
                available:true
            }

        };

    }


};



const client =
new SurgicalKernelClient(mockKernel);



const response =
await client.execute({

    system:"BH-SMC",

    action:"generate_report",

    context:{
        pilot:true
    },

    request:{
        type:"SECIS"
    }

});



console.log(
    "SDK CONTRACT RESPONSE:"
);

console.log(response);
