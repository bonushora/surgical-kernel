import { Router } from "express";
import { createExecution, getExecution, getAllExecutions } from "../store/executionStore.js";
const router = Router();
router.post("/execute", async (req, res) => {
    const execution = createExecution({
        executionId: crypto.randomUUID(),
        projectId: req.body.projectId ?? "unknown",
        mode: req.body.mode ?? "free",
        request: req.body.request ?? "",
        state: "initialized",
        createdAt: new Date().toISOString()
    });
    res.json({
        executionId: execution.executionId,
        status: "accepted",
        mode: execution.mode,
        state: execution.state
    });
});
router.get("/execution/:id", async (req, res) => {
    const execution = getExecution(req.params.id);
    if (!execution) {
        return res.status(404)
            .json({
            error: "execution not found"
        });
    }
    res.json(execution);
});
router.get("/executions", async (req, res) => {
    res.json(getAllExecutions());
});
router.get("/snapshots/:id", async (req, res) => {
    const execution = getExecution(req.params.id);
    if (!execution) {
        return res.status(404)
            .json({
            error: "snapshot not found"
        });
    }
    res.json({
        executionId: execution.executionId,
        snapshot: {
            projectId: execution.projectId,
            mode: execution.mode,
            state: execution.state,
            request: execution.request
        }
    });
});
export default router;
