CREATE TABLE IF NOT EXISTS businesses(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS queue_entries(
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    business_id BIGINT NOT NULL REFERENCES businesses(id),
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20) NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING'
        CHECK (status IN ('WAITING', 'CALLED', 'SERVED', 'CANCELLED')),
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    served_at TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_queue_business_status
ON queue_entries(business_id, status, joined_at);