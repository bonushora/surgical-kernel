export class TraceEvent {


    constructor(type,data={}){


        this.type = type;


        this.data = data;


        this.timestamp =
        new Date().toISOString();


    }


}
