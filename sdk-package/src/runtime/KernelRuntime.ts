import type { HttpTransport } from "./http/HttpTransport";
import type { MiddlewarePipeline } from "./middleware/MiddlewarePipeline";
import type { Telemetry } from "./telemetry/Telemetry";
import type { AuthProvider } from "./auth/AuthProvider";
import type { RetryPolicy } from "./retry/RetryPolicy";


export interface KernelRuntimeConfig {

    transport: HttpTransport;

    middleware: MiddlewarePipeline;

    telemetry: Telemetry;

    auth: AuthProvider;

    retry: RetryPolicy;

}


export class KernelRuntime {


    private transport: HttpTransport;

    private middleware: MiddlewarePipeline;

    private telemetry: Telemetry;

    private auth: AuthProvider;

    private retry: RetryPolicy;



    constructor(
        config: KernelRuntimeConfig
    ){

        this.transport =
            config.transport;

        this.middleware =
            config.middleware;

        this.telemetry =
            config.telemetry;

        this.auth =
            config.auth;

        this.retry =
            config.retry;

    }



    async execute(
        request: unknown
    ){


        const prepared =
            await this.middleware.before(
                request
            );


        const authenticated =
            await this.auth.authorize(
                prepared
            );


        const response =
            await this.retry.execute(

                () =>
                    this.transport.send(
                        authenticated
                    )

            );


        await this.telemetry.capture(

            authenticated,

            response

        );


        return await this.middleware.after(
            response
        );

    }

}
