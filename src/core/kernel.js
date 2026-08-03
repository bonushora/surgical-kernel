import { RequestGateway }
from "../gateway/requestGateway.js";

import { PolicyEngine }
from "../policies/policyEngine.js";

import { ProviderFactory }
from "../providers/providerFactory.js";

import { ResponseValidator }
from "../validators/responseValidator.js";

import { AuditEngine }
from "../audit/auditEngine.js";

import { SnapshotEngine }
from "../snapshot/snapshotEngine.js";


export class SurgicalKernel {


constructor(){


this.gateway =
new RequestGateway();


this.policy =
new PolicyEngine();


this.provider =
ProviderFactory.create("mock");


this.validator =
new ResponseValidator();


this.audit =
new AuditEngine();


this.snapshot =
new SnapshotEngine();


}



async execute(input){


const request =
this.gateway.process(input);



const policyDecision =
this.policy.validate(request);



if(
policyDecision.decision !== "ALLOW"
){

const audit =
this.audit.record({

request,

policy:
policyDecision,

status:
"BLOCKED"

});


const snapshot =
this.snapshot.create({

request,

policy:
policyDecision,

audit

});


return {

blocked:true,

policy:
policyDecision,

audit,

snapshot

};


}



const response =
await this.provider.execute(request);



this.validator.validate(response);



const audit =
this.audit.record({

request,

policy:
policyDecision,

response

});



const snapshot =
this.snapshot.create({

request,

response,

policy:
policyDecision,

audit

});



return {

response,

policy:
policyDecision,

audit,

snapshot

};


}


}
