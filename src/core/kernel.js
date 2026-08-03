import { RequestGateway }
from "../gateway/requestGateway.js";

import { PolicyEngine }
from "../policies/policyEngine.js";

import { ContextBuilder }
from "../context/contextBuilder.js";

import { PromptComposer }
from "../prompt/promptComposer.js";

import { ProviderFactory }
from "../providers/providerFactory.js";

import { ResponseValidator }
from "../validators/responseValidator.js";

import { AuditEngine }
from "../audit/auditEngine.js";

import { SnapshotEngine }
from "../snapshot/snapshotEngine.js";

import { ExecutionTrace }
from "../trace/executionTrace.js";


export class SurgicalKernel {


constructor(){


this.gateway =
new RequestGateway();


this.policy =
new PolicyEngine();


this.context =
new ContextBuilder();


this.prompt =
new PromptComposer();


this.provider =
ProviderFactory.create("mock");


this.validator =
new ResponseValidator();


this.audit =
new AuditEngine();


this.snapshot =
new SnapshotEngine();


}




async execute(request){


const trace =
new ExecutionTrace();



trace.record(
"REQUEST_RECEIVED",
request
);



const normalized =
this.gateway.process(request);



trace.record(
"REQUEST_NORMALIZED",
normalized
);



const policyDecision =
this.policy.validate(normalized);



trace.record(
"POLICY_CHECKED",
policyDecision
);



if(policyDecision.decision==="DENY"){


const audit =
this.audit.record({

request:normalized,

policy:policyDecision,

status:"BLOCKED"

});


trace.record(
"EXECUTION_BLOCKED",
policyDecision
);



return {


blocked:true,


policy:policyDecision,


audit,


trace:
trace.getTrace(),


snapshot:
this.snapshot.create({

request:normalized,

policy:policyDecision,

audit

})


};


}



const context =
this.context.build(
request.context || {}
);



trace.record(
"CONTEXT_BUILT",
context
);



const composedPrompt =
this.prompt.compose(
normalized,
context
);



trace.record(
"PROMPT_COMPOSED",
composedPrompt
);



const response =
await this.provider.execute({

...normalized,

prompt:
composedPrompt

});



trace.record(
"PROVIDER_EXECUTED",
response
);



this.validator.validate(response);



trace.record(
"RESPONSE_VALIDATED",
{

valid:true

}
);



const audit =
this.audit.record({

request:normalized,

policy:policyDecision,

context,

prompt:composedPrompt,

response

});



trace.record(
"AUDIT_CREATED",
audit
);



const snapshot =
this.snapshot.create({

request:normalized,

policy:policyDecision,

context,

prompt:composedPrompt,

response,

audit

});



trace.record(
"SNAPSHOT_CREATED",
snapshot
);



return {


response,

policy:policyDecision,

context,

prompt:composedPrompt,

audit,

trace:
trace.getTrace(),

snapshot


};


}


}
