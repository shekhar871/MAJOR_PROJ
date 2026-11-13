# PocketBridge
> A local-first smartphone and computer companion system.

PocketBridge connects your phone and laptop over the same local Wi-Fi network without relying on third-party cloud drives or messaging intermediaries.

---

## Project Team and Subject Deliverables

| Member | Subject | Primary Deliverable | Owned Directory |
| :--- | :--- | :--- | :--- |
| **Mahin Patel** | **DE** (Data Engineering) | ER Model, PostgreSQL Schema, 3NF Proof, SQL Reports and Concurrency Tests | `db/` |
| **Kunal Kumar Jha** | **ASD** (App Software Dev) | Express REST API, JWT/bcrypt Auth, Pairing Logic, Multer File Service | `server/`, `docs/api-contract.md` |
| **Shekhar Jadhav** | **ISD** (Interactive Systems) | React Native Mobile App, Electron Desktop App, lightweight Terminal CLI | `apps/` |

---

## Architecture and Highlights

- **Local-First REST API:** Built with Node.js and Express running on the computer LAN interface.
- **Relational PostgreSQL and 3NF:** 7 core tables strictly normalized in 3NF.
- **Atomic Device Pairing:** Concurrency-safe one-time QR pairing protected with PostgreSQL row-level locks (`SELECT FOR UPDATE`).
- **File Handoff:** Binary files saved to local filesystem (`server/storage/`), tracked via UUID keys and SHA-256 checksums in the database.
- **Cross-Platform Clients:**
  - **Mobile:** React Native / Expo.
  - **Desktop:** Electron + React companion.
  - **Terminal:** Node.js command-line interface.

---

## Quick Setup Guide

### 1. Database Setup (PostgreSQL)
```bash
# Create database and apply schema + seeds
psql -U postgres -d postgres -c "CREATE DATABASE pocketbridge;"
psql -U postgres -d pocketbridge -f db/schema.sql
psql -U postgres -d pocketbridge -f db/seeds/seed.sql
```

### 2. Backend Server
```bash
cd server
npm install
cp ../.env.example .env
npm start
# Server listens on http://0.0.0.0:4000
```

### 3. Mobile App (Expo)
```bash
cd apps/mobile
npm install
npm start
```

### 4. Desktop Client (Electron)
```bash
cd apps/desktop
npm install
npm start
```

### 5. Terminal CLI
```bash
cd apps/cli
node pocketbridge.js status
node pocketbridge.js tasks list
```

---

## Project Documentation
- [Data Dictionary and ERD](file:///Users/shekharjadhav/Downloads/MAJOR_PROJ/db/docs/data-dictionary.md)
- [3NF Normalization Analysis](file:///Users/shekharjadhav/Downloads/MAJOR_PROJ/db/docs/normalization-3nf.md)
- [ACID and Concurrency Proof](file:///Users/shekharjadhav/Downloads/MAJOR_PROJ/db/docs/acid-concurrency.md)
- [REST API Contract](file:///Users/shekharjadhav/Downloads/MAJOR_PROJ/docs/api-contract.md)
- [Individual Contributions](file:///Users/shekharjadhav/Downloads/MAJOR_PROJ/docs/contributions/)
- [AI Chat Index](file:///Users/shekharjadhav/Downloads/MAJOR_PROJ/docs/ai-history/AI-CHAT-INDEX.md)
