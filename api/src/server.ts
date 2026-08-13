import express from "express";
import cors from "cors";

import kernelRoutes from "./routes/kernelRoutes.js";

import operationRoutes from "./routes/operationRoutes.js";

import {
    recoverExecutions
} from "./runtime/recovery/ExecutionRecovery.js";


const recoveredExecutions =
    recoverExecutions();


console.log(
    `Surgical Kernel Recovery V1: ${recoveredExecutions} execution(s) recovered`
);


const app = express();


app.use(cors());

app.use(express.json());


app.use(
    "/v1",
    operationRoutes
);


app.use(
    "/kernel",
    kernelRoutes
);


app.use(
"/",
kernelRoutes
);

const PORT = 8080;


app.listen(
    PORT,
    () => {
        console.log(
            `Surgical Kernel API running on port ${PORT}`
        );
    }
);
