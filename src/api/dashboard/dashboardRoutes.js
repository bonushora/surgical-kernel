export class DashboardRoutes {


    constructor(controller){

        this.controller =
        controller;

    }



    routes(){


        return {


            metrics:
            () =>
            this.controller.overview(),


            executions:
            () =>
            this.controller.executions(),



            snapshot:
            (id) =>
            this.controller.snapshot(id)


        };


    }


}
