import type {
    ExecutionContext
}
from "./ExecutionContext";


import type {
    ExecutionMode
}
from "./ExecutionMode";


export interface ExecutionRequest {

    context: ExecutionContext;

    projectId: string;

    mode: ExecutionMode;

    request: string;

}
