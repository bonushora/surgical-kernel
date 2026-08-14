type ExecutionRole = "consumer" | "provider";
interface ExecutionContext {
    organizationId: string;
    projectId: string;
    actorId: string;
    role: ExecutionRole;
    targetProjectId?: string;
}

type ExecutionMode = "free" | "deterministic";

interface OperationRequest {
    context: ExecutionContext;
    mode: ExecutionMode;
    request: string;
}

type ExecutionStatus = "initialized" | "running" | "completed" | "failed";

type OperationStatus = "accepted" | "completed" | "failed";
interface OperationResponse {
    operationId: string;
    correlationId: string;
    executionId: string;
    status: OperationStatus;
    state: ExecutionStatus;
    mode: ExecutionMode;
    result?: Record<string, unknown>;
}

interface OperationOptions {
    operationId?: string;
    correlationId?: string;
    idempotencyKey?: string;
}
declare class SurgicalKernelClient {
    private endpoint;
    constructor(endpoint: string);
    execute(request: OperationRequest, options?: OperationOptions): Promise<OperationResponse>;
}

interface HttpTransportConfig {
    endpoint: string;
    headers?: Record<string, string>;
}
declare class HttpTransport {
    private endpoint;
    private headers;
    constructor(config: HttpTransportConfig);
    send(payload: unknown): Promise<unknown>;
}

interface Middleware {
    before?(value: unknown): Promise<unknown> | unknown;
    after?(value: unknown): Promise<unknown> | unknown;
}
declare class MiddlewarePipeline {
    private middlewares;
    constructor();
    use(middleware: Middleware): this;
    before(request: unknown): Promise<unknown>;
    after(response: unknown): Promise<unknown>;
}

type TelemetryCollector = (event: TelemetryEvent) => Promise<void> | void;
interface TelemetryConfig {
    collector?: TelemetryCollector;
}
interface TelemetryEvent {
    timestamp: string;
    request: unknown;
    response: unknown;
}
declare class Telemetry {
    private collector?;
    private events;
    constructor(config?: TelemetryConfig);
    capture(request: unknown, response: unknown): Promise<TelemetryEvent>;
    getEvents(): TelemetryEvent[];
}

type AuthStrategy = (request: unknown) => Promise<unknown> | unknown;
interface AuthProviderConfig {
    strategy?: AuthStrategy;
}
declare class AuthProvider {
    private strategy?;
    constructor(config?: AuthProviderConfig);
    authorize(request: unknown): Promise<unknown>;
}

interface RetryPolicyConfig {
    retries?: number;
    delay?: number;
}
type RetryOperation = () => Promise<unknown>;
declare class RetryPolicy {
    private retries;
    private delay;
    constructor(config?: RetryPolicyConfig);
    execute(operation: RetryOperation): Promise<unknown>;
    private wait;
}

interface KernelRuntimeConfig {
    transport: HttpTransport;
    middleware: MiddlewarePipeline;
    telemetry: Telemetry;
    auth: AuthProvider;
    retry: RetryPolicy;
}
declare class KernelRuntime {
    private transport;
    private middleware;
    private telemetry;
    private auth;
    private retry;
    constructor(config: KernelRuntimeConfig);
    execute(request: unknown): Promise<unknown>;
}

interface Plugin {
    initialize?(context: unknown): Promise<void> | void;
}
declare class PluginManager {
    private plugins;
    constructor();
    register(plugin: Plugin): this;
    initialize(context: unknown): Promise<void>;
    getPlugins(): Plugin[];
}

export { AuthProvider, type ExecutionContext, type ExecutionMode, type ExecutionRole, type ExecutionStatus, HttpTransport, KernelRuntime, type KernelRuntimeConfig, MiddlewarePipeline, type OperationOptions, type OperationRequest, type OperationResponse, type OperationStatus, PluginManager, RetryPolicy, SurgicalKernelClient, Telemetry };
