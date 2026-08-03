export class KernelRuntime {

    constructor({

        transport,
        middleware,
        telemetry,
        auth,
        retry

    }){

        this.transport = transport;
        this.middleware = middleware;
        this.telemetry = telemetry;
        this.auth = auth;
        this.retry = retry;

    }

    async execute(request){

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
