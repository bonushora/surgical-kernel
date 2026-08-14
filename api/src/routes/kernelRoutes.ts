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
