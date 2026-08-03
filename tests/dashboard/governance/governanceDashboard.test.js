import { GovernanceDashboardService }
from "../../../src/dashboard/governance/governanceDashboardService.js";


const service =
new GovernanceDashboardService();



const executions = [


{


executionId:
"exec-gov-001",


policy:{
decision:"ALLOW"
},


trace:{
events:[

{
type:"REQUEST",
timestamp:"2026-08-03T00:00:00Z"
},

{
type:"VALIDATION",
timestamp:"2026-08-03T00:00:01Z"
}

]

}


},


{


executionId:
"exec-gov-002",


policy:{
decision:"REVIEW"
},


blocked:true,


trace:{
events:[

{
type:"REQUEST",
timestamp:"2026-08-03T00:01:00Z"
}

]

}


}


];



console.log(
"GOVERNANCE DASHBOARD:"
);


console.log(
JSON.stringify(
service.overview(executions),
null,
2
)
);
