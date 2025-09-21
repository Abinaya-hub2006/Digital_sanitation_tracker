-- backend/migrations/init.sql
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(200) NOT NULL,
    role_id INT REFERENCES roles(id)
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    user_id INT REFERENCES users(id),
    worker_id INT REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (name) VALUES ('Admin'), ('Teacher'), ('Student'), ('Worker');
