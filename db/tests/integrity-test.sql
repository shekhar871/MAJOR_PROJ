-- Database integrity test script
-- 1. Try duplicate email (Expect error 23505)
DO $$
BEGIN
  INSERT INTO users (full_name, email, password_hash)
  VALUES ('Dup User', 'shekhar@pocketbridge.local', 'hash123');
  RAISE EXCEPTION 'Test failed: Duplicate email was accepted';
EXCEPTION WHEN unique_violation THEN
  RAISE NOTICE 'PASSED: Duplicate email correctly rejected';
END $$;

-- 2. Try invalid task status (Expect check violation)
DO $$
BEGIN
  INSERT INTO tasks (device_id, title, status)
  VALUES ('aaaa1111-aaaa-1111-aaaa-111111111111', 'Invalid status task', 'completed_not_allowed');
  RAISE EXCEPTION 'Test failed: Invalid status was accepted';
EXCEPTION WHEN check_violation THEN
  RAISE NOTICE 'PASSED: Invalid status check constraint enforced';
END $$;
