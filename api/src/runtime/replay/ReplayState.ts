import {
    ExecutionContext
} from "../context/ExecutionContext.js";

export interface ReplayState {

    executionId:string;

    context: ExecutionContext;

    projectId:string;

    mode:
        "free"
        |
        "deterministic";

    request:string;

    state:string;

    reconstructed:boolean;

    eventCount:number;

}
