export class RequestGateway {


process(request){


return {

user:
request.user,

action:
request.action,

prompt:
request.prompt,

context:
request.context || {},

timestamp:
new Date().toISOString()

};


}


}
