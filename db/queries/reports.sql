-- PocketBridge SQL Reporting & Analytical Queries

-- Report 1: Task summary grouped by user and status
SELECT 
    u.full_name,
    t.status,
    COUNT(t.task_id) AS total_tasks,
    COUNT(CASE WHEN t.priority = 'high' THEN 1 END) AS high_priority_count
FROM users u
JOIN devices d ON u.user_id = d.user_id
JOIN tasks t ON d.device_id = t.device_id
GROUP BY u.user_id, u.full_name, t.status
ORDER BY u.full_name, t.status;

-- Report 2: File transfer history with daily volume
SELECT 
    DATE(f.created_at) AS transfer_date,
    d.device_name AS source_device,
    COUNT(f.file_id) AS file_count,
    ROUND(SUM(f.size_bytes)::numeric / 1048576, 2) AS total_mb_transferred
FROM files f
JOIN devices d ON f.source_device_id = d.device_id
WHERE f.status = 'stored'
GROUP BY DATE(f.created_at), d.device_name
ORDER BY transfer_date DESC;

-- Report 3: Active devices and activity summary
SELECT 
    u.email,
    d.device_name,
    d.platform,
    d.last_seen_at,
    COUNT(DISTINCT n.note_id) AS total_notes_created,
    COUNT(DISTINCT f.file_id) AS total_files_uploaded
FROM users u
JOIN devices d ON u.user_id = d.user_id
LEFT JOIN notes n ON d.device_id = n.device_id
LEFT JOIN files f ON d.device_id = f.source_device_id
GROUP BY u.email, d.device_id, d.device_name, d.platform, d.last_seen_at;
