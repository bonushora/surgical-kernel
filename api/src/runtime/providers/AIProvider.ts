import type {
    ExecutionContext
} from "../context/ExecutionContext.js";

export interface AIProviderRequest {

    request: string;

    context: ExecutionContext;

    projectId: string;

    mode:
        | "free"
        | "deterministic";

}

export interface AIProviderResponse {

    output: string;

    provider: string;

    model: string;

    metadata?:
        Record<string, unknown>;

}

export interface AIProvider {

    readonly provider: string;

    readonly model: string;

    execute(
        input: AIProviderRequest
    ): Promise<AIProviderResponse>;

}
