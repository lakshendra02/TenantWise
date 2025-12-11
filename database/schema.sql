-- CREATE DATABASE carboledger;

-- \c carboledger;

CREATE TYPE plan_type AS ENUM ('FREE', 'PRO');
CREATE TYPE role_type AS ENUM ('ADMIN', 'USER');
CREATE TYPE trans_type AS ENUM ('IN', 'OUT');

CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    plan plan_type DEFAULT 'FREE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    role role_type DEFAULT 'USER'
);

CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    current_stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP DEFAULT NULL
);

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER REFERENCES tenants(id),
    material_id INTEGER REFERENCES materials(id),
    type trans_type NOT NULL,
    quantity INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);