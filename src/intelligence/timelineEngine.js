export class TimelineEngine {


    generate(trace){


        if(!trace?.events){

            return [];

        }


        return trace.events.map(
            event => ({


                type:
                event.type,


                timestamp:
                event.timestamp


            })
        );


    }


}
