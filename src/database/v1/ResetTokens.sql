CREATE TABLE reset_tokens (
    token_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    token_value VARCHAR(255) NOT NULL,
    expiration_timestamp TIMESTAMPTZ NOT NULL,
    used BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
