CREATE TABLE IF NOT EXISTS surgical_kernel.executions (
    execution_id TEXT PRIMARY KEY,
    context JSONB NOT NULL,
    project_id TEXT NOT NULL,
    mode TEXT NOT NULL,
    request TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    result JSONB,
    updated_at TIMESTAMPTZ
);
