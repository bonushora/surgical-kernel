export class ExecutionRequest {

    constructor({
        system,
        action,
        context = {},
        request
    }){

        this.system = system;
        this.action = action;
        this.context = context;
        this.request = request;

    }

}
