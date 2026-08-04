import express from "express";
import cors from "cors";
import kernelRoutes from "./routes/kernelRoutes.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use("/kernel", kernelRoutes);
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Surgical Kernel API running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map