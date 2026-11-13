# Subject Contribution Report: Application Software Development (ASD)
**Contributor:** Kunal Kumar Jha  
**Subject:** Application Software Development (ASD)

### Key Deliverables Completed:
1. **REST API Architecture & Bootstrap:**
   - Initialized modular Express application with CORS, JSON parsing, and centralized error handling.
   - Built Prisma ORM schema mirroring PostgreSQL tables.
2. **Authentication & Authorization:**
   - Implemented `POST /api/auth/register` with atomic user & initial device creation.
   - Bcrypt password hashing (10 salt rounds) and JWT signing/verification.
   - Scoped authorization middleware verifying active device ownership on every protected endpoint.
3. **Pairing Code Lifecycle:**
   - Single-use 5-minute pairing code generation.
   - Atomic consumption endpoint utilizing row-level locks to prevent double-consumption race conditions.
4. **File Handling:**
   - Multer streaming integration with 25MB cap.
   - UUID storage keys on local filesystem and SHA-256 checksum calculation.
   - Owner-validated file streaming and download routes.
5. **API Contract & Documentation:**
   - Published complete REST contract in `docs/api-contract.md`.
