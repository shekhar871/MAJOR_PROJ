-- PocketBridge PostgreSQL Relational Schema
-- Designed for 3NF compliance with explicit integrity constraints

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS activity_logs CASCADE;
DROP TABLE IF EXISTS files CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS pairing_codes CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(191) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE devices (
    device_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE RESTRICT,
    device_name VARCHAR(100) NOT NULL,
    platform VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE pairing_codes (
    pairing_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by_device_id UUID NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    consumed_by_device_id UUID REFERENCES devices(device_id) ON DELETE SET NULL,
    code_hash VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE notes (
    note_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(device_id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(device_id) ON DELETE RESTRICT,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '' NOT NULL,
    priority VARCHAR(10) DEFAULT 'medium' NOT NULL,
    status VARCHAR(20) DEFAULT 'todo' NOT NULL,
    due_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE files (
    file_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_device_id UUID NOT NULL REFERENCES devices(device_id) ON DELETE RESTRICT,
    target_device_id UUID REFERENCES devices(device_id) ON DELETE SET NULL,
    original_name VARCHAR(255) NOT NULL,
    storage_key VARCHAR(255) NOT NULL UNIQUE,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    checksum_sha256 VARCHAR(64) NOT NULL,
    direction VARCHAR(20) DEFAULT 'to_desktop' NOT NULL,
    status VARCHAR(20) DEFAULT 'stored' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TABLE activity_logs (
    activity_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID NOT NULL REFERENCES devices(device_id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id VARCHAR(64) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
