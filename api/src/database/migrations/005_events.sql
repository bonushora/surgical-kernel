CREATE TABLE IF NOT EXISTS surgical_kernel.execution_events (
    event_sequence BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    event_id TEXT NOT NULL,
    execution_id TEXT NOT NULL,
    type TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL,
    payload JSONB NOT NULL
);

CREATE INDEX IF NOT EXISTS execution_events_execution_sequence_idx
ON surgical_kernel.execution_events (
    execution_id,
    event_sequence
);
