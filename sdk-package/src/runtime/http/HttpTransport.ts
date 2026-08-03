export interface HttpTransportConfig {

    endpoint: string;

    headers?: Record<string,string>;

}


export class HttpTransport {


    private endpoint:string;

    private headers:Record<string,string>;



    constructor(
        config: HttpTransportConfig
    ){

        this.endpoint =
            config.endpoint;

        this.headers =
            config.headers ?? {};

    }



    async send(
        payload: unknown
    ): Promise<unknown>{


        const response =

            await fetch(

                this.endpoint,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":
                            "application/json",

                        ...this.headers

                    },

                    body:

                        JSON.stringify(
                            payload
                        )

                }

            );



        if(!response.ok){

            throw new Error(

                `Kernel request failed: ${response.status}`

            );

        }



        return await response.json();

    }


}
