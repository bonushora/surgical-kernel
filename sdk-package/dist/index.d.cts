interface ExecutionRequest {
    system: string;
    action: string;
    context?: Record<string, unknown>;
    request: unknown;
}

interface ExecutionResponse {
    result: unknown;
    decision: "ALLOW" | "REVIEW" | "BLOCK";
    risk: {
        score: number;
        classification: string;
    };
    audit: any;
    snapshot: any;
    replay: any;
}

declare class SurgicalKernelClient {
    private endpoint;
    constructor(endpoint: string);
    execute(request: ExecutionRequest): Promise<ExecutionResponse>;
}

export { type ExecutionRequest, type ExecutionResponse, SurgicalKernelClient };
