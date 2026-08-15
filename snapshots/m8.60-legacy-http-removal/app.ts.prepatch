import express from "express";
import cors from "cors";

import kernelRoutes from "./routes/kernelRoutes.js";

import operationRoutes from "./routes/operationRoutes.js";

import authorizationAuditRoutes
    from "./routes/authorizationAuditRoutes.js";

import {
    recoverExecutions
} from "./runtime/recovery/ExecutionRecovery.js";


const recoveredExecutions =
    recoverExecutions();


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


app.use(
    "/kernel",
    kernelRoutes
);


app.use(
    "/",
    kernelRoutes
);


export default app;
