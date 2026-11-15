# Subject Contribution Report: Application Software Development (ASD)
**Lead Contributor:** Kunal Kumar Jha  
**Collaborators:** Mahin Patel, Shekhar Jadhav

### Primary Responsibilities (Kunal):
- Bootstrapped Node.js + Express backend server with CORS, JSON body parser, and centralized error handling middleware.
- Built authentication system using `bcrypt` password hashing (10 salt rounds) and signed JWT tokens with device association.
- Developed `POST /api/pairings` and `POST /api/pairings/consume` endpoints with 5-minute expiration and atomic consumption locks.
- Implemented file streaming upload/download service using `multer` with a 25MB cap, UUID storage naming, and SHA-256 integrity checksum verification.
- Implemented CRUD REST APIs for Notes and Tasks with status filtering and ownership checks.
- Documented full API endpoint specifications and JSON contracts in `docs/api-contract.md`.

### Cross-Subject Contributions:
- **In DE (Database):** Reviewed SQL constraints with Mahin and built the Prisma schema mirroring the relational tables.
- **In ISD (Frontend):** Assisted Shekhar with debugging multipart/form-data boundary handling for mobile document uploads.
