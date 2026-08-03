export class RetryPolicy {


    constructor({

        retries = 3,

        delay = 500

    } = {}){


        this.retries =
            retries;


        this.delay =
            delay;


    }



    async execute(operation){


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


    }



    async wait(){


        return new Promise(

            resolve =>

                setTimeout(
                    resolve,
                    this.delay
                )

        );


    }


}
