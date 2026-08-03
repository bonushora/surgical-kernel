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



const normalized =
this.gateway.process(request);



const policyDecision =
this.policy.validate(normalized);



if(policyDecision.decision==="DENY"){


const audit =
this.audit.record({

request:normalized,

policy:policyDecision,

status:"BLOCKED"

});


return {


blocked:true,


policy:policyDecision,


audit,


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



const composedPrompt =
this.prompt.compose(
normalized,
context
);



const response =
await this.provider.execute({

...normalized,

prompt:
composedPrompt

});



this.validator.validate(response);



const audit =
this.audit.record({

request:normalized,

policy:policyDecision,

context,

prompt:composedPrompt,

response

});



return {


response,


policy:policyDecision,


context,


prompt:composedPrompt,


audit,


snapshot:
this.snapshot.create({

request:normalized,

policy:policyDecision,

context,

prompt:composedPrompt,

response,

audit

})


};


}


}
