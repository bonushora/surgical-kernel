import { Router } from "express";

import {
    getExecution,
    getAllExecutions
} from "../store/executionStore.js";

import {
    ExecutionService
} from "../runtime/service/ExecutionService.js";


import {
    getEvents
} from "../runtime/events/EventStore.js";


import {
    replayExecution
} from "../runtime/replay/EventReplay.js";


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

                context:
                    req.body.context ?? {
                        organizationId:
                            req.body.organizationId ?? "unknown",

                        projectId:
                            req.body.projectId ?? "unknown",

                        actorId:
                            req.body.actorId ?? "anonymous",

                        role:
                            req.body.role ?? "consumer"
                    },

                projectId:
                    req.body.projectId ?? "unknown",

                mode:
                    req.body.mode ?? "free",

                request:
                    req.body.request ?? ""

            });


        const started =
            executionService.start(
                execution
            );


        const executed =
            await executionService.execute(
                started
            );


        const completed =
            executionService.complete(
                executed
            );


        res.json({

            executionId:
                completed.executionId,

            status:
                "accepted",

            mode:
                completed.mode,

            state:
                completed.status,

            result:
                completed.result

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

            context:
                stored.context,

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

            context:
                stored.context,

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




router.get(
    "/execution/:id/events",
    async(req,res)=>{


        const events =
            getEvents(
                req.params.id
            );


        res.json(
            {
                executionId:
                    req.params.id,

                events
            }
        );

    }
);



router.get(
    "/execution/:id/replay",
    async(req,res)=>{


        const replay =
            replayExecution(
                req.params.id
            );


        if(!replay){

            return res.status(404)
                .json({
                    error:
                    "execution replay not found"
                });

        }


        res.json({

            executionId:
                req.params.id,

            replay

        });

    }
);



export default router;
