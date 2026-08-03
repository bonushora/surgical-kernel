export interface RetryPolicyConfig {

    retries?: number;

    delay?: number;

}



export type RetryOperation = () => Promise<unknown>;



export class RetryPolicy {


    private retries:number;

    private delay:number;



    constructor(

        config:RetryPolicyConfig = {}

    ){

        this.retries =
            config.retries ?? 3;


        this.delay =
            config.delay ?? 500;

    }



    async execute(

        operation:RetryOperation

    ):Promise<unknown>{


        let attempt = 0;



        while(

            attempt <= this.retries

        ){


            try {


                return await operation();


            } catch(error){


                attempt++;



                if(

                    attempt > this.retries

                ){

                    throw error;

                }



                await this.wait();


            }


        }


        throw new Error(
            "Retry execution failed"
        );


    }



    private async wait():Promise<void>{


        return new Promise(

            resolve =>

                setTimeout(

                    resolve,

                    this.delay

                )

        );


    }


}
