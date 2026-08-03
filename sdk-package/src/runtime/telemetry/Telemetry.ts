export type TelemetryCollector = (

    event: TelemetryEvent

) => Promise<void> | void;



export interface TelemetryConfig {

    collector?: TelemetryCollector;

}



export interface TelemetryEvent {

    timestamp:string;

    request:unknown;

    response:unknown;

}



export class Telemetry {


    private collector?: TelemetryCollector;

    private events:TelemetryEvent[];



    constructor(

        config:TelemetryConfig = {}

    ){

        this.collector =
            config.collector;


        this.events = [];

    }



    async capture(

        request:unknown,

        response:unknown

    ):Promise<TelemetryEvent>{


        const event:TelemetryEvent = {


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



    getEvents():TelemetryEvent[]{


        return this.events;


    }


}
