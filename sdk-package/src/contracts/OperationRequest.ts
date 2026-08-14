import type {
    ExecutionContext
}
from "./ExecutionContext";

import type {
    ExecutionMode
}
from "./ExecutionMode";


export interface OperationRequest {

    context: ExecutionContext;

    mode: ExecutionMode;

    request: string;

}
