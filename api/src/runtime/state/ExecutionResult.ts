export interface ExecutionResult {

    output: string;

    provider: string;

    model: string;

    metadata?:
        Record<string, unknown>;

}
