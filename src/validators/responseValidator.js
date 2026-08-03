
export class ResponseValidator {


validate(response){


if(!response.content){

throw new Error(
"Resposta inválida"
);

}


return true;


}


}

