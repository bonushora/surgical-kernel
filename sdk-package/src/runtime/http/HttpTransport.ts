export class HttpTransport {


    constructor({

        endpoint,

        headers = {}

    }){

        this.endpoint = endpoint;
        this.headers = headers;

    }



    async send(payload){


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
