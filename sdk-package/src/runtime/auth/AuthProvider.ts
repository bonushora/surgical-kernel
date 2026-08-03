export type AuthStrategy = (

    request: unknown

) => Promise<unknown> | unknown;



export interface AuthProviderConfig {

    strategy?: AuthStrategy;

}



export class AuthProvider {


    private strategy?: AuthStrategy;



    constructor(

        config: AuthProviderConfig = {}

    ){

        this.strategy =
            config.strategy;

    }



    async authorize(

        request: unknown

    ): Promise<unknown>{


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
