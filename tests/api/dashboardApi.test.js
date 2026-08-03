import { ExecutionRepository }
from "../../src/dashboard/executionRepository.js";

import { SnapshotRepository }
from "../../src/dashboard/snapshotRepository.js";

import { DashboardService }
from "../../src/dashboard/dashboardService.js";

import { DashboardController }
from "../../src/dashboard/dashboardController.js";

import { DashboardRoutes }
from "../../src/api/dashboard/dashboardRoutes.js";



const executions =
new ExecutionRepository();



const snapshots =
new SnapshotRepository();



executions.save({

executionId:
"exec-api-001",

policy:{
decision:
"ALLOW"
}

});



snapshots.save({

executionId:
"exec-api-001",

snapshotVersion:
"BH-SDP-v1"

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



const api =
new DashboardRoutes(
controller
);



console.log(
"Dashboard API Metrics:"
);

console.log(
api.routes().metrics()
);



console.log(
"Dashboard API Snapshot:"
);

console.log(
api.routes().snapshot(
"exec-api-001"
)
);

