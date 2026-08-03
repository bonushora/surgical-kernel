export interface Middleware {


    before?(
        value: unknown
    ): Promise<unknown> | unknown;


    after?(
        value: unknown
    ): Promise<unknown> | unknown;


}



export class MiddlewarePipeline {


    private middlewares: Middleware[];



    constructor(){

        this.middlewares = [];

    }



    use(
        middleware: Middleware
    ){

        this.middlewares.push(
            middleware
        );


        return this;

    }



    async before(
        request: unknown
    ): Promise<unknown>{


        let result =
            request;



        for(
            const middleware
            of this.middlewares
        ){


            if(
                middleware.before
            ){

                result =
                    await middleware.before(
                        result
                    );

            }

        }


        return result;

    }



    async after(
        response: unknown
    ): Promise<unknown>{


        let result =
            response;



        for(
            const middleware
            of [
                ...this.middlewares
            ].reverse()
        ){


            if(
                middleware.after
            ){

                result =
                    await middleware.after(
                        result
                    );

            }

        }


        return result;

    }


}
