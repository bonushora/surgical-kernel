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




    executionSnapshot(id){


        return {

            snapshot:
            this.dashboard.snapshot(id)

        };


    }


}
