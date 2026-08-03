export class ExecutionRepository {


    constructor(){

        this.executions = [];

    }



    save(execution){


        this.executions.push(
            execution
        );


    }



    list(){


        return this.executions;


    }



    findById(id){


        return this.executions.find(
            item =>
            item.executionId === id
        );


    }


}
