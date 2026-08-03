import { IntelligenceService }
from "../../src/intelligence/intelligenceService.js";


const service =
new IntelligenceService();



const execution = {


executionId:
"exec-intelligence-001",


policy:{
decision:"REVIEW"
},


blocked:true,


context:{
blocked:[
"token"
]
},


trace:{
events:[
{
type:"REQUEST",
timestamp:"2026-08-03T00:00:00Z"
},
{
type:"POLICY_CHECK",
timestamp:"2026-08-03T00:00:01Z"
}
]

}


};



console.log(
"INTELLIGENCE ANALYSIS:"
);


console.log(
service.analyze(execution)
);
