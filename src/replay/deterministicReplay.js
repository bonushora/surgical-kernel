import { ReplayState }
from "./replayState.js";


export class DeterministicReplay {



    replay(snapshot){


        if(!snapshot){


            throw new Error(
                "Snapshot obrigatório para replay"
            );


        }



        return {


            replayed:true,


            state:
            new ReplayState(snapshot),


            execution:


            {


                request:
                snapshot.data.request || null,


                policy:
                snapshot.data.policy || null,


                context:
                snapshot.data.context || null,


                prompt:
                snapshot.data.prompt || null,


                response:
                snapshot.data.response || null,


                audit:
                snapshot.data.audit || null


            },



            replayTimestamp:
            new Date().toISOString()


        };


    }


}
