import {
    closePersistence,
    configurePersistenceFromEnvironment
} from "./runtime/persistence/PersistenceComposition.js";


await configurePersistenceFromEnvironment();


const {
    default: app
} =
    await import(
        "./app.js"
    );


const PORT =
    Number(
        process.env.PORT ??
        8080
    );


const server =
    app.listen(
    PORT,
    () => {

        console.log(
            `Surgical Kernel API running on port ${PORT}`
        );

    }
);


let shuttingDown =
    false;


async function shutdown(
    signal: NodeJS.Signals
): Promise<void> {

    if (shuttingDown) {

        return;

    }


    shuttingDown =
        true;


    server.close(
        async error => {

            if (error) {

                process.exitCode =
                    1;

            }


            try {

                await closePersistence();

            } catch (closeError) {

                console.error(
                    `Failed to close persistence after ${signal}.`,
                    closeError
                );

                process.exitCode =
                    1;

            }

        }
    );

}


process.on(
    "SIGINT",
    () => {
        void shutdown(
            "SIGINT"
        );
    }
);


process.on(
    "SIGTERM",
    () => {
        void shutdown(
            "SIGTERM"
        );
    }
);


export default app;
