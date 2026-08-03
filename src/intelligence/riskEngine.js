export class RiskEngine {


    calculate(execution){


        let score = 0;


        if(
            execution.policy?.decision === "REVIEW"
        ){

            score += 50;

        }


        if(
            execution.blocked === true
        ){

            score += 40;

        }


        if(
            execution.context?.blocked?.length > 0
        ){

            score += 10;

        }



        let classification =
        "LOW";


        if(score >= 70){

            classification = "HIGH";

        }
        else if(score >= 40){

            classification = "MEDIUM";

        }



        return {


            executionId:
            execution.executionId,


            riskScore:
            score,


            classification


        };


    }


}
