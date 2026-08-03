export class SnapshotRepository {


    constructor(){

        this.snapshots = [];

    }



    save(snapshot){


        this.snapshots.push(
            snapshot
        );


    }



    list(){


        return this.snapshots;


    }



    findByExecution(id){


        return this.snapshots.find(
            item =>
            item.executionId === id
        );


    }


}
