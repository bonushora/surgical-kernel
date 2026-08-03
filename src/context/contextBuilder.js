import { ContextPolicy }
from "./contextPolicy.js";


export class ContextBuilder {


    constructor(){

        this.policy =
        ContextPolicy.DEFAULT_CONTEXT_POLICY;

    }



    build(data){


        const context = {};

        const blocked = [];



        Object.entries(data || {})
        .forEach(([key,value])=>{


            if(
                this.policy.blockedFields
                .includes(key)
            ){

                blocked.push(key);

                return;

            }



            context[key]=value;


        });



        return {

            context,

            blocked,

            policy:
            this.policy.name,

            created:
            new Date().toISOString()

        };


    }


}
