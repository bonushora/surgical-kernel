
export class RequestGateway {


process(request){


return {

user: request.user,

prompt: request.prompt,

context: request.context || {},

timestamp: new Date().toISOString()

};


}


}

