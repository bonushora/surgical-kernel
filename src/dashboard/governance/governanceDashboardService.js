import { GovernanceDashboard }
from "./governanceDashboard.js";


import { ExecutionTimeline }
from "./executionTimeline.js";


export class GovernanceDashboardService {


    constructor(){


        this.dashboard =
        new GovernanceDashboard();


        this.timeline =
        new ExecutionTimeline();


    }




    overview(executions = []){


        return {


            governance:
            this.dashboard.generate(
                executions
            ),


            executions:
            executions.map(
                execution => ({


                    id:
                    execution.executionId,


                    timeline:
                    this.timeline.generate(
                        execution.trace
                    )


                })
            )


        };


    }


}
