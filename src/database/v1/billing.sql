Create TABLE Billing {
    cid INT PRIMARY KEY,
    plan_id INT,
    expires_at TIMESTAMP,
    max_credits INT,
    remaining_credits INT,
    transaction_id VARCHAR(255),
    payment_status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plan_id) REFERENCES Plans(id)
}