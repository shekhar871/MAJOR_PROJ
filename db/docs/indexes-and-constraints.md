# Database Constraints and Indexes

### CHECK Constraints:
1. `devices.platform`: `CHECK (platform IN ('android', 'ios', 'desktop', 'cli'))`
2. `tasks.priority`: `CHECK (priority IN ('low', 'medium', 'high'))`
3. `tasks.status`: `CHECK (status IN ('todo', 'in_progress', 'done'))`
4. `files.size_bytes`: `CHECK (size_bytes > 0 AND size_bytes <= 26214400)` (25MB cap)
5. `files.direction`: `CHECK (direction IN ('to_desktop', 'to_mobile'))`
6. `files.status`: `CHECK (status IN ('stored', 'deleted', 'failed'))`

### B-Tree Indexes:
- `idx_devices_user_active` ON devices(user_id, is_active)
- `idx_pairing_codes_expiry` ON pairing_codes(expires_at)
- `idx_notes_device_updated` ON notes(device_id, updated_at DESC)
- `idx_tasks_device_status_due` ON tasks(device_id, status, due_at)
- `idx_files_source_created` ON files(source_device_id, created_at DESC)
- `idx_activity_device_created` ON activity_logs(device_id, created_at DESC)
