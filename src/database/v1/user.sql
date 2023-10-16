CREATE TABLE  (
    cid serial PRIMARY KEY,
    company_name varchar(255),
    description varchar(255),
    website varchar(255),
    created_at timestamp,
    updated_at timestamp,
    user_id int, -- Foreign key reference to users table
    FOREIGN KEY (user_id) REFERENCES users(uid)
);
