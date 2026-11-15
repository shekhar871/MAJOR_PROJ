# Subject Contribution Report: Data Engineering (DE)
**Lead Contributor:** Mahin Patel  
**Collaborators:** Kunal Kumar Jha, Shekhar Jadhav

### Primary Responsibilities (Mahin):
- Designed relational ER model with 7 core tables: `users`, `devices`, `pairing_codes`, `notes`, `tasks`, `files`, and `activity_logs`.
- Drafted complete 3NF normalization justification (`db/docs/normalization-3nf.md`) explaining atomic fields, whole-key dependencies, and why binary files are stored on disk instead of Postgres BLOBs.
- Created `schema.sql` with primary keys, foreign key constraints, check constraints (`platform`, `status`, `priority`), and indexes.
- Implemented ACID concurrency analysis and `SELECT ... FOR UPDATE` row-locking proof for device pairing (`db/docs/acid-concurrency.md`).
- Wrote analytical queries for task distribution, daily file upload statistics, and device activity (`db/queries/reports.sql`).

### Cross-Subject Contributions:
- **In ASD (Backend):** Collaborated with Kunal on connecting `pg` pool queries with transaction rollbacks during pairing token consumption.
- **In ISD (Frontend):** Tested Electron desktop file lists against database row insertions to confirm synchronization.
