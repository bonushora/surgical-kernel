CREATE TABLE IF NOT EXISTS surgical_kernel.idempotency_records (
    idempotency_key TEXT PRIMARY KEY,
    fingerprint TEXT NOT NULL,
    operation_id TEXT NOT NULL,
    correlation_id TEXT NOT NULL,
    state TEXT NOT NULL,
    response JSONB
);
