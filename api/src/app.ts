import express from "express";
import cors from "cors";

import operationRoutes from "./routes/operationRoutes.js";

import authorizationAuditRoutes
    from "./routes/authorizationAuditRoutes.js";

import {
    recoverExecutions
} from "./runtime/recovery/ExecutionRecovery.js";

import {
    getExecutionRepository
} from "./runtime/persistence/PersistenceComposition.js";


const recoveredExecutions =
    await recoverExecutions(
        getExecutionRepository()
    );


console.log(
    `Surgical Kernel Recovery V1: ${recoveredExecutions} execution(s) recovered`
);


const app =
    express();


app.use(
    cors()
);

app.use(
    express.json()
);


app.get(
    "/health",
    (_req, res) => {

        res.status(200).json({

            status:
                "ok",

            service:
                "surgical-kernel",

            version:
                "0.1.1"

        });

    }
);


app.use(
    "/v1",
    operationRoutes
);


app.use(
    "/v1",
    authorizationAuditRoutes
);


export default app;
