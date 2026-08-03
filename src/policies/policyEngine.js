
export class PolicyEngine {


validate(request){


if(!request.prompt){

throw new Error(
"Prompt obrigatório"
);

}


return true;


}


}

