import { ValidationRules }
from "./validationRules.js";


import { ResponsePolicy }
from "./responsePolicy.js";



export class ResponseValidator {



constructor(){


this.rules =
ValidationRules.DEFAULT_RESPONSE_RULES;


this.policy =
ResponsePolicy.DEFAULT_RESPONSE_POLICY;


}



validate(response){


const errors = [];



// Campos obrigatórios

this.rules.requiredFields
.forEach(field=>{


if(
response[field]===undefined ||
response[field]===null
){

errors.push(
`Campo obrigatório ausente: ${field}`
);

}


});



// Conteúdo vazio

if(
!this.policy.allowEmpty &&
(!response.content ||
response.content.trim()==="")
){

errors.push(
"Resposta vazia"
);

}



// Limite de tamanho

if(
response.content &&
response.content.length >
this.policy.maxLength
){

errors.push(
"Resposta excede tamanho permitido"
);

}



// Padrões proibidos

this.rules.blockedPatterns
.forEach(pattern=>{


if(
response.content
.toLowerCase()
.includes(pattern)
){

errors.push(
`Padrão bloqueado encontrado: ${pattern}`
);

}


});




if(errors.length){


return {


valid:false,

policy:
this.policy.name,

errors

};


}



return {


valid:true,

policy:
this.policy.name

};


}



}
