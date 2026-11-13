-- PocketBridge Demo Seed Data
-- 2 Users, 3 Devices, 5 Notes, 8 Tasks, 5 File Metadata entries

INSERT INTO users (user_id, full_name, email, password_hash) VALUES
('11111111-1111-1111-1111-111111111111', 'Shekhar Jadhav', 'shekhar@pocketbridge.local', '$2b$10$vO8F3t5Xv/sM67YgqL.m7O3BkVQ8X6eU3rXpZ2Ea7bN4Kq5yZ8Rie'),
('22222222-2222-2222-2222-222222222222', 'Test Teammate', 'evaluator@college.edu', '$2b$10$vO8F3t5Xv/sM67YgqL.m7O3BkVQ8X6eU3rXpZ2Ea7bN4Kq5yZ8Rie');

INSERT INTO devices (device_id, user_id, device_name, platform, is_active) VALUES
('aaaa1111-aaaa-1111-aaaa-111111111111', '11111111-1111-1111-1111-111111111111', 'MacBook Pro Host', 'desktop', TRUE),
('bbbb2222-bbbb-2222-bbbb-222222222222', '11111111-1111-1111-1111-111111111111', 'Android Companion', 'android', TRUE),
('cccc3333-cccc-3333-cccc-333333333333', '22222222-2222-2222-2222-222222222222', 'Evaluator Laptop', 'desktop', TRUE);

INSERT INTO notes (note_id, device_id, title, body, is_pinned) VALUES
('d1111111-0000-0000-0000-000000000001', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'Meeting Notes', 'Discussed 3NF normalization and LAN file handoff protocol.', TRUE),
('d1111111-0000-0000-0000-000000000002', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Architecture Decisions', 'Files stored on disk under server/storage; PostgreSQL stores only metadata and SHA256.', FALSE),
('d1111111-0000-0000-0000-000000000003', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'Wi-Fi Pairing Plan', 'One-time 6-digit code or QR scanning over local LAN subnet.', TRUE),
('d1111111-0000-0000-0000-000000000004', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Presentation Checklist', 'Prepare slides, live demo on phone, verify Postman endpoints.', FALSE),
('d1111111-0000-0000-0000-000000000005', 'cccc3333-cccc-3333-cccc-333333333333', 'Evaluator Test Note', 'Sample isolated note for cross-account security testing.', FALSE);

INSERT INTO tasks (task_id, device_id, title, description, priority, status) VALUES
('e1111111-0000-0000-0000-000000000001', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Setup PostgreSQL DB', 'Create schema and test constraints locally', 'high', 'done'),
('e1111111-0000-0000-0000-000000000002', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Implement Express Auth', 'Register, login, and JWT middleware', 'high', 'done'),
('e1111111-0000-0000-0000-000000000003', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'Expo QR Scanner Flow', 'Camera scanner component to read pairing JSON', 'medium', 'in_progress'),
('e1111111-0000-0000-0000-000000000004', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'File Picker on Mobile', 'Use document picker to upload photos/docs', 'high', 'todo'),
('e1111111-0000-0000-0000-000000000005', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Electron Inbox Screen', 'Render list of received files with open folder button', 'medium', 'todo'),
('e1111111-0000-0000-0000-000000000006', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Write CLI client', 'Status and task list terminal commands', 'low', 'todo'),
('e1111111-0000-0000-0000-000000000007', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'Verify 3NF Proof', 'Write functional dependencies explanation doc', 'medium', 'done'),
('e1111111-0000-0000-0000-000000000008', 'cccc3333-cccc-3333-cccc-333333333333', 'Secondary Account Task', 'Isolation verification task', 'low', 'todo');

INSERT INTO files (file_id, source_device_id, original_name, storage_key, mime_type, size_bytes, checksum_sha256, direction, status) VALUES
('f1111111-0000-0000-0000-000000000001', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'project_outline.pdf', 'file_seed_001.pdf', 'application/pdf', 1048576, 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'to_desktop', 'stored'),
('f1111111-0000-0000-0000-000000000002', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'mockup_diagram.png', 'file_seed_002.png', 'image/png', 524288, '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945', 'to_desktop', 'stored'),
('f1111111-0000-0000-0000-000000000003', 'bbbb2222-bbbb-2222-bbbb-222222222222', 'lab_report.docx', 'file_seed_003.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 314572, '5d41402abc4b2a76b9719d911017c592', 'to_desktop', 'stored'),
('f1111111-0000-0000-0000-000000000004', 'aaaa1111-aaaa-1111-aaaa-111111111111', 'code_snippet.txt', 'file_seed_004.txt', 'text/plain', 4096, '7d793037a0760186574b0282f2f435e7', 'to_mobile', 'stored'),
('f1111111-0000-0000-0000-000000000005', 'cccc3333-cccc-3333-cccc-333333333333', 'evaluator_doc.pdf', 'file_seed_005.pdf', 'application/pdf', 204800, '098f6bcd4621d373cade4e832627b4f6', 'to_desktop', 'stored');
