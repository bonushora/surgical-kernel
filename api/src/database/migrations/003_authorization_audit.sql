CREATE TABLE IF NOT EXISTS surgical_kernel.authorization_audits (
    audit_id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    operation_id TEXT NOT NULL,
    correlation_id TEXT NOT NULL,
    decision_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    project_id TEXT NOT NULL,
    actor_id TEXT,
    mode TEXT NOT NULL,
    decision TEXT NOT NULL,
    reason TEXT,
    idempotency_key TEXT
);

CREATE INDEX IF NOT EXISTS authorization_audits_operation_timestamp_idx
ON surgical_kernel.authorization_audits (
    operation_id,
    timestamp
);
