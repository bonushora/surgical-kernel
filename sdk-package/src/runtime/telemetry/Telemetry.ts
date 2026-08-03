export class Telemetry {


    constructor({

        collector = null

    } = {}){


        this.collector =
            collector;


        this.events = [];

    }



    async capture(

        request,

        response

    ){


        const event = {


            timestamp:
                new Date().toISOString(),


            request,


            response


        };



        this.events.push(
            event
        );



        if(
            this.collector
        ){

            await this.collector(
                event
            );

        }



        return event;


    }



    getEvents(){


        return this.events;


    }


}
