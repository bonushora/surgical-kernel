import { Router } from "express";

import {
    getExecution,
    getAllExecutions
} from "../store/executionStore.js";

import {
    ExecutionService
} from "../runtime/service/ExecutionService.js";


const router = Router();


const executionService =
    new ExecutionService();



router.post(
    "/execute",
    async (req,res)=>{


        const execution =
            executionService.create({

                executionId:
                    crypto.randomUUID(),

                projectId:
                    req.body.projectId ?? "unknown",

                mode:
                    req.body.mode ?? "free",

                request:
                    req.body.request ?? ""

            });



        res.json({

            executionId:
                execution.executionId,

            status:
                "accepted",

            mode:
                execution.mode,

            state:
                execution.status

        });

    }
);



router.post(
    "/execution/:id/start",
    async(req,res)=>{


        const stored =
            getExecution(
                req.params.id
            );


        if(!stored){

            return res.status(404)
                .json({
                    error:
                    "execution not found"
                });

        }


        const execution = {

            executionId:
                stored.executionId,

            projectId:
                stored.projectId,

            mode:
                stored.mode as "free" | "deterministic",

            request:
                stored.request,

            status:
                stored.state as any,

            createdAt:
                stored.createdAt,

            updatedAt:
                stored.createdAt

        };


        const updated =
            executionService.start(
                execution
            );


        res.json(updated);

    }
);



router.post(
    "/execution/:id/complete",
    async(req,res)=>{


        const stored =
            getExecution(
                req.params.id
            );


        if(!stored){

            return res.status(404)
                .json({
                    error:
                    "execution not found"
                });

        }


        const execution = {

            executionId:
                stored.executionId,

            projectId:
                stored.projectId,

            mode:
                stored.mode as "free" | "deterministic",

            request:
                stored.request,

            status:
                stored.state as any,

            createdAt:
                stored.createdAt,

            updatedAt:
                stored.createdAt

        };


        const updated =
            executionService.complete(
                execution
            );


        res.json(updated);

    }
);



router.get(
    "/execution/:id/history",
    async(req,res)=>{


        res.json(
            executionService.history(
                req.params.id
            )
        );

    }
);



router.get(
    "/execution/:id",
    async(req,res)=>{


        const execution =
            getExecution(
                req.params.id
            );


        if(!execution){

            return res.status(404)
                .json({
                    error:
                    "execution not found"
                });

        }


        res.json(
            execution
        );

    }
);



router.get(
    "/executions",
    async(req,res)=>{


        res.json(
            getAllExecutions()
        );

    }
);



router.get(
    "/snapshots/:id",
    async(req,res)=>{


        const execution =
            getExecution(
                req.params.id
            );


        if(!execution){

            return res.status(404)
                .json({
                    error:
                    "snapshot not found"
                });

        }


        res.json({

            executionId:
                execution.executionId,

            snapshot:{

                projectId:
                    execution.projectId,

                mode:
                    execution.mode,

                state:
                    execution.state,

                request:
                    execution.request

            }

        });

    }
);



export default router;
