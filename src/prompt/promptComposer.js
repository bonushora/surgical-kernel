import { PromptPolicy }
from "./promptPolicy.js";


import { SystemPrompt }
from "./systemPrompt.js";



export class PromptComposer {



constructor(){


this.policy =
PromptPolicy.DEFAULT_PROMPT_POLICY;


}



compose(request, context){


return {


system:
SystemPrompt.DEFAULT,


rules:
this.policy.systemRules,


user:
request.prompt,


context:
context.context || {},


created:
new Date().toISOString()


};


}


}
