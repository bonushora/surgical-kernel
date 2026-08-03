import { PolicyRegistry }
from "./policyRegistry.js";


export class PolicyEngine {


constructor(){

    this.policy =
    PolicyRegistry.DEFAULT_AI_POLICY;

}



validate(request){


    if(!request.action){

        throw new Error(
            "Action obrigatória"
        );

    }



    if(
        this.policy.denied
        .includes(request.action)
    ){

        return {

            decision:
            "DENY",

            policy:
            this.policy.name,

            reason:
            "Operation not allowed"

        };

    }



    if(
        this.policy.allowed
        .includes(request.action)
    ){

        return {

            decision:
            "ALLOW",

            policy:
            this.policy.name

        };

    }



    return {

        decision:
        "REVIEW",

        policy:
        this.policy.name,

        reason:
        "Action requires review"

    };


}


}
