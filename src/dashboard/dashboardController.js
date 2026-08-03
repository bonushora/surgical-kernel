export class DashboardController {


    constructor(
        dashboardService
    ){

        this.dashboard =
        dashboardService;

    }



    overview(){


        return {


            metrics:
            this.dashboard.metrics(),


            executions:
            this.dashboard.executionsList()


        };


    }



    executions(){


        return this.dashboard.executionsList();


    }



    snapshot(id){


        return {


            snapshot:
            this.dashboard.snapshot(id)


        };


    }


}
