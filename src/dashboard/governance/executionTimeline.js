export class ExecutionTimeline {


    generate(trace = {}){


        if(!trace.events){

            return [];

        }


        return trace.events.map(
            event => ({


                event:
                event.type,


                timestamp:
                event.timestamp


            })
        );


    }


}
