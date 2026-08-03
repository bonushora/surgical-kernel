import { RiskEngine }
from "./riskEngine.js";


import { TimelineEngine }
from "./timelineEngine.js";


export class IntelligenceService {


    constructor(){

        this.risk =
        new RiskEngine();


        this.timeline =
        new TimelineEngine();

    }



    analyze(execution){


        return {


            risk:
            this.risk.calculate(
                execution
            ),


            timeline:
            this.timeline.generate(
                execution.trace
            )


        };


    }


}
