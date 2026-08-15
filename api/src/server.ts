import app from "./app.js";


const PORT =
    Number(
        process.env.PORT ??
        8080
    );


app.listen(
    PORT,
    () => {

        console.log(
            `Surgical Kernel API running on port ${PORT}`
        );

    }
);


export default app;
