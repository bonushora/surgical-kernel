import { TraceEvent }
from "./traceEvent.js";


export class ExecutionTrace {


    constructor(){


        this.events = [];


    }



    record(type,data={}){


        const event =
        new TraceEvent(
            type,
            data
        );


        this.events.push(event);


        return event;


    }



    getTrace(){


        return {


            executionId:
            crypto.randomUUID(),


            events:
            this.events,


            created:
            new Date().toISOString()


        };


    }


}
