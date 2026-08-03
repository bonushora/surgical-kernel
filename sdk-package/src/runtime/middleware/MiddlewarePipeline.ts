export class MiddlewarePipeline {


    constructor(){

        this.middlewares = [];

    }



    use(middleware){

        this.middlewares.push(
            middleware
        );

        return this;

    }



    async before(request){


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



    async after(response){


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
