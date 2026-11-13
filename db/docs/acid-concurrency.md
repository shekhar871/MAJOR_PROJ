# PocketBridge ACID Transactions & Concurrency Report

## 1. Problem Statement: The Race Condition in Device Pairing
When a user scans a pairing QR code or enters a pairing token, two rapid or concurrent requests could attempt to consume the exact same code simultaneously. In an unmanaged database, both transactions might read `used_at IS NULL` concurrently, creating two separate devices from a single one-time token.

## 2. Solution: Pessimistic Row-Level Locking (`SELECT ... FOR UPDATE`)
PocketBridge solves this concurrency conflict inside a PostgreSQL transaction:

```sql
BEGIN;
SELECT pairing_id, created_by_device_id, expires_at, used_at 
FROM pairing_codes 
WHERE code_hash = $1 
FOR UPDATE;

-- Validate code state
-- Insert new device
-- Mark pairing consumed:
UPDATE pairing_codes 
SET used_at = CURRENT_TIMESTAMP, consumed_by_device_id = $new_device_id 
WHERE pairing_id = $pairing_id;

COMMIT;
```

## 3. Concurrency Test Execution & Evidence
We simulated two concurrent `POST /api/pairings/consume` requests executing with 0ms delay between them.
- **Request 1:** Acquired row lock, verified unused status, created device record, and set `used_at`. Result: `200 OK`.
- **Request 2:** Blocked until Request 1 committed, then evaluated the updated row where `used_at IS NOT NULL`. Result: `409 Conflict: Pairing code has already been consumed`.
- **Integrity Result:** Exactly 1 device registered. 0 orphaned devices.
