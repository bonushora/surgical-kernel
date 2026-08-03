import { MetricsEngine }
from "../metricsEngine.js";


import { RiskEngine }
from "../../intelligence/riskEngine.js";


export class GovernanceDashboard {


    constructor(){


        this.metrics =
        new MetricsEngine();


        this.risk =
        new RiskEngine();


    }



    generate(executions = []){


        return {


            metrics:
            this.metrics.calculate(
                executions
            ),


            risks:
            executions.map(
                execution =>
                this.risk.calculate(
                    execution
                )
            ),


            generated:
            new Date().toISOString()


        };


    }


}
