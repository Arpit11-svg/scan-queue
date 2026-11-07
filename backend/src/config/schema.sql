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

-- Allow customers to leave phone number empty
ALTER TABLE queue_entries
ALTER COLUMN mobile DROP NOT NULL;

-- Store the number of people in a party
ALTER TABLE queue_entries
ADD COLUMN IF NOT EXISTS party_size INTEGER NOT NULL DEFAULT 1
CHECK (party_size BETWEEN 1 AND 20);

ALTER TABLE queue_entries
ADD COLUMN IF NOT EXISTS token_number INTEGER;

-- Generate a secure public identifier for queue tracking
ALTER TABLE queue_entries
ADD COLUMN IF NOT EXISTS public_token UUID NOT NULL DEFAULT gen_random_uuid();

-- Store customer notification consent
ALTER TABLE queue_entries
ADD COLUMN IF NOT EXISTS notification_consent BOOLEAN NOT NULL DEFAULT FALSE;

-- Ensure public tokens are unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_public_token
ON queue_entries(public_token);

-- Ensure token numbers are unique within a business
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_business_token
ON queue_entries(business_id, token_number)
WHERE token_number IS NOT NULL;