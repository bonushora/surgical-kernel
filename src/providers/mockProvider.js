import { Provider }
from "./interfaces/provider.js";


export class MockProvider extends Provider {



async execute(request){


let content;



if(typeof request.prompt === "object"){


content =
`
Modelo: ${request.model || "mock-provider"}

Usuário:
${request.prompt.user}

Contexto:
${JSON.stringify(request.prompt.context)}

Regras:
${request.prompt.rules.join("; ")}

`;



}else{


content =
`Resposta simulada para: ${request.prompt}`;


}



return {


model:
"mock-provider",


content,


timestamp:
new Date().toISOString()


};


}


}
