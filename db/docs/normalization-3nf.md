# PocketBridge - 3NF Normalization Report

## 1. Functional Dependencies
- **users**:
  - `user_id -> full_name, email, password_hash, created_at`
  - `email -> user_id, full_name, password_hash, created_at`
- **devices**:
  - `device_id -> user_id, device_name, platform, is_active, last_seen_at, created_at`
- **pairing_codes**:
  - `pairing_id -> created_by_device_id, consumed_by_device_id, code_hash, expires_at, used_at, created_at`
  - `code_hash -> pairing_id, created_by_device_id, expires_at`
- **notes**:
  - `note_id -> device_id, title, body, is_pinned, created_at, updated_at`
- **tasks**:
  - `task_id -> device_id, title, description, priority, status, due_at, created_at, updated_at`
- **files**:
  - `file_id -> source_device_id, target_device_id, original_name, storage_key, mime_type, size_bytes, checksum_sha256, direction, status, created_at`
  - `storage_key -> file_id, original_name, size_bytes`
- **activity_logs**:
  - `activity_id -> device_id, action_type, target_type, target_id, created_at`

## 2. Normal Forms Evaluation
- **1NF (First Normal Form)**:
  - All attributes contain atomic, indivisible values.
  - No repeating groups or multivalued columns (e.g., tasks or device tags are not stored as comma-separated text).
  - Every table has a clearly defined primary key.
- **2NF (Second Normal Form)**:
  - The schema meets 1NF.
  - All tables use single-column surrogate primary keys (`UUID`).
  - Thus, no partial dependency on a composite key is possible; every non-key attribute is fully functionally dependent on the entire primary key.
- **3NF (Third Normal Form)**:
  - The schema meets 2NF.
  - No non-key attribute is transitively dependent on the primary key via another non-key attribute.
  - Crucial design decision: `notes`, `tasks`, and `files` store only `device_id` (the creator device), NOT `user_id`.
  - The owning user is resolved via the relational join: `entity.device_id -> devices.device_id -> devices.user_id`.
  - Storing `user_id` in `notes` would create a transitive dependency (`note_id -> device_id -> user_id`), violating 3NF.

## 3. Storage Architecture: Why Files Are Kept on Disk
- Storing binary file blobs directly in PostgreSQL degrades buffer pool caching and slows table scans.
- PocketBridge stores raw files on the local filesystem under `server/storage/` indexed by a UUID `storage_key`.
- The database stores only metadata, MIME types, and SHA-256 integrity checksums.
