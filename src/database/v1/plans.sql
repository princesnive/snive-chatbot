CREATE TABLE Plans (
    plan_id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    price INT,
    features JSONB, -- Use the JSONB data type for better JSON support
    currency VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT current_timestamp,
    updated_at TIMESTAMPTZ DEFAULT current_timestamp
);
