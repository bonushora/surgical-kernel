export class MetricsEngine {


    calculate(executions = []){


        return {


            total:
            executions.length,


            allowed:
            executions.filter(
                e =>
                e.policy?.decision === "ALLOW"
            ).length,


            review:
            executions.filter(
                e =>
                e.policy?.decision === "REVIEW"
            ).length,


            blocked:
            executions.filter(
                e =>
                e.blocked === true
            ).length


        };


    }


}
