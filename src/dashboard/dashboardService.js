import { MetricsEngine }
from "./metricsEngine.js";


export class DashboardService {


    constructor(
        executionRepository,
        snapshotRepository
    ){


        this.executions =
        executionRepository;


        this.snapshots =
        snapshotRepository;


        this.metricsEngine =
        new MetricsEngine();


    }




    metrics(){


        return this.metricsEngine.calculate(
            this.executions.list()
        );


    }




    executionsList(){


        return this.executions.list();


    }




    snapshot(id){


        return this.snapshots.findByExecution(id);


    }


}
