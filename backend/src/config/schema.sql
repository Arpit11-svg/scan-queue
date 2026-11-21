-- ============================================
-- 1. BUSINESSES
-- ============================================

CREATE TABLE IF NOT EXISTS businesses (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. QUEUE ENTRIES
-- ============================================

CREATE TABLE IF NOT EXISTS queue_entries (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    business_id BIGINT NOT NULL
        REFERENCES businesses(id),

    -- Customer details
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(20),
    description TEXT,
    party_size INTEGER NOT NULL DEFAULT 1
        CHECK (party_size BETWEEN 1 AND 20),

    -- Queue management
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING'
        CHECK (status IN (
            'WAITING',
            'CALLED',
            'SERVED',
            'CANCELLED'
        )),

    token_number INTEGER,

    -- Customer tracking and notifications
    public_token UUID NOT NULL DEFAULT gen_random_uuid(),
    notification_consent BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    served_at TIMESTAMP
);

-- ============================================
-- INDEXES
-- ============================================

-- Optimize business queue lookups by status and joining time
CREATE INDEX IF NOT EXISTS idx_queue_business_status
ON queue_entries(business_id, status, joined_at);

-- Ensure public tokens are unique
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_public_token
ON queue_entries(public_token);

-- Ensure token numbers are unique within a business
CREATE UNIQUE INDEX IF NOT EXISTS idx_queue_business_token
ON queue_entries(business_id, token_number)
WHERE token_number IS NOT NULL;