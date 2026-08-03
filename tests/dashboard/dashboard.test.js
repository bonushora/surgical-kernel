import { ExecutionRepository }
from "../../src/dashboard/executionRepository.js";


import { SnapshotRepository }
from "../../src/dashboard/snapshotRepository.js";


import { DashboardService }
from "../../src/dashboard/dashboardService.js";


import { DashboardController }
from "../../src/dashboard/dashboardController.js";



const executions =
new ExecutionRepository();



const snapshots =
new SnapshotRepository();



executions.save({

executionId:"exec-001",

policy:{
decision:"ALLOW"
}

});



snapshots.save({

executionId:"exec-001",

snapshotVersion:"BH-SDP-v1"

});



const service =
new DashboardService(
executions,
snapshots
);



const controller =
new DashboardController(
service
);



console.log(
"Dashboard Overview:"
);


console.log(
controller.overview()
);



console.log(
"Snapshot:"
);


console.log(
controller.executionSnapshot(
"exec-001"
)
);
