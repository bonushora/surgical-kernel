export interface ExecutionRequest {

    system: string;

    action: string;

    context?: Record<string, unknown>;

    request: unknown;

}
