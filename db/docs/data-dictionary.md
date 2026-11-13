# PocketBridge - Data Dictionary

This document outlines the core entities, data types, nullability, and descriptions for the PocketBridge relational schema.

### 1. Table: users
- **user_id**: UUID, Primary Key. Unique identifier for an account owner.
- **full_name**: VARCHAR(120), NOT NULL. User's displayed name.
- **email**: VARCHAR(191), NOT NULL, UNIQUE. Lowercase unique email address.
- **password_hash**: VARCHAR(255), NOT NULL. Bcrypt hashed password string.
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 2. Table: devices
- **device_id**: UUID, Primary Key. Unique client identifier.
- **user_id**: UUID, NOT NULL, Foreign Key -> users(user_id) ON DELETE RESTRICT.
- **device_name**: VARCHAR(100), NOT NULL. Friendly machine label (e.g. 'Shekhar Phone').
- **platform**: VARCHAR(20), NOT NULL, CHECK (platform IN ('android', 'ios', 'desktop', 'cli')).
- **is_active**: BOOLEAN, NOT NULL, DEFAULT TRUE. Soft-disable flag.
- **last_seen_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 3. Table: pairing_codes
- **pairing_id**: UUID, Primary Key. Short-lived pairing invitation.
- **created_by_device_id**: UUID, NOT NULL, FK -> devices(device_id) ON DELETE CASCADE.
- **consumed_by_device_id**: UUID, NULL, FK -> devices(device_id) ON DELETE SET NULL.
- **code_hash**: VARCHAR(64), NOT NULL, UNIQUE. SHA-256 hash of plaintext code.
- **expires_at**: TIMESTAMP WITH TIME ZONE, NOT NULL. Short validity window (e.g. 5 minutes).
- **used_at**: TIMESTAMP WITH TIME ZONE, NULL. Populated upon atomic consumption.
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 4. Table: notes
- **note_id**: UUID, Primary Key.
- **device_id**: UUID, NOT NULL, FK -> devices(device_id) ON DELETE RESTRICT.
- **title**: VARCHAR(200), NOT NULL. Note headline.
- **body**: TEXT, NOT NULL. Note text payload.
- **is_pinned**: BOOLEAN, NOT NULL, DEFAULT FALSE.
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.
- **updated_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 5. Table: tasks
- **task_id**: UUID, Primary Key.
- **device_id**: UUID, NOT NULL, FK -> devices(device_id) ON DELETE RESTRICT.
- **title**: VARCHAR(200), NOT NULL.
- **description**: TEXT, NOT NULL, DEFAULT ''.
- **priority**: VARCHAR(10), NOT NULL, DEFAULT 'medium', CHECK (priority IN ('low', 'medium', 'high')).
- **status**: VARCHAR(20), NOT NULL, DEFAULT 'todo', CHECK (status IN ('todo', 'in_progress', 'done')).
- **due_at**: TIMESTAMP WITH TIME ZONE, NULL.
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.
- **updated_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 6. Table: files
- **file_id**: UUID, Primary Key.
- **source_device_id**: UUID, NOT NULL, FK -> devices(device_id) ON DELETE RESTRICT.
- **target_device_id**: UUID, NULL, FK -> devices(device_id) ON DELETE SET NULL.
- **original_name**: VARCHAR(255), NOT NULL. Original file name from client.
- **storage_key**: VARCHAR(255), NOT NULL, UNIQUE. Disk filename UUID under /server/storage/.
- **mime_type**: VARCHAR(100), NOT NULL.
- **size_bytes**: BIGINT, NOT NULL, CHECK (size_bytes > 0 AND size_bytes <= 26214400).
- **checksum_sha256**: VARCHAR(64), NOT NULL. Hex-encoded file checksum.
- **direction**: VARCHAR(20), NOT NULL, DEFAULT 'to_desktop', CHECK (direction IN ('to_desktop', 'to_mobile')).
- **status**: VARCHAR(20), NOT NULL, DEFAULT 'stored', CHECK (status IN ('stored', 'deleted', 'failed')).
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.

### 7. Table: activity_logs
- **activity_id**: UUID, Primary Key.
- **device_id**: UUID, NOT NULL, FK -> devices(device_id) ON DELETE CASCADE.
- **action_type**: VARCHAR(50), NOT NULL.
- **target_type**: VARCHAR(50), NOT NULL.
- **target_id**: VARCHAR(64), NOT NULL.
- **created_at**: TIMESTAMP WITH TIME ZONE, NOT NULL, DEFAULT CURRENT_TIMESTAMP.
