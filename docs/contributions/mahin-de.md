# Subject Contribution Report: Data Engineering (DE)
**Contributor:** Mahin Patel  
**Subject:** Data Engineering (DE)

### Key Deliverables Completed:
1. **Relational Database Design & ER Model:**
   - Designed 7 core entities: `users`, `devices`, `pairing_codes`, `notes`, `tasks`, `files`, `activity_logs`.
   - Built editable Mermaid source in `db/er/er-diagram.mmd`.
2. **Third Normal Form (3NF) Normalization:**
   - Proved 1NF, 2NF, and 3NF across all entities.
   - Designed `device_id` foreign keys in `notes`, `tasks`, and `files` to avoid transitive dependencies on `user_id`.
   - Stored binary files outside PostgreSQL under `server/storage/`, storing only metadata and SHA-256 checksums in DB.
3. **DDL Constraints & Indexes:**
   - Implemented `CHECK` constraints for platform, task status/priority, and file size limits (25MB cap).
   - Created B-tree indexes for device-scaffolded queries and timestamps.
4. **ACID Transactions & Concurrency Test:**
   - Authored pessimistic row locking strategy (`SELECT ... FOR UPDATE`) for one-time pairing codes.
   - Verified that simultaneous pairing attempts return `409 Conflict` without orphaned records.
5. **SQL Reporting Queries:**
   - Authored reports for task breakdown, daily file transfer volumes, and device activity summaries.
