export class AuthProvider {


    constructor({

        strategy

    } = {}){


        this.strategy =
            strategy;


    }



    async authorize(request){


        if(
            !this.strategy
        ){

            return request;

        }



        return await this.strategy(
            request
        );


    }


}
