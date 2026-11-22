# PocketBridge 🌉

> **High-speed, local-first synchronization and peer-to-peer data bridge connecting smartphones, laptops, and terminal clients over local Wi-Fi — with zero cloud dependency.**

[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B%20%7C%2016%20%7C%2018-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.19-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![React Native](https://img.shields.io/badge/React%20Native-0.74%20%7C%20Expo%2051-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactnative.dev/)
[![Electron](https://img.shields.io/badge/Electron-30.0-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-7.10-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Database Schema](https://img.shields.io/badge/Schema-3NF%20%2F%20BCNF%20Compliant-success?style=flat-square)](db/docs/normalization-3nf.md)

---

## 📑 Table of Contents

- [1. Project Banner and Introduction](#1-project-banner-and-introduction)
- [2. Project Overview](#2-project-overview)
- [3. Key Features](#3-key-features)
- [4. Screenshots and Demo](#4-screenshots-and-demo)
- [5. Technology Stack](#5-technology-stack)
- [6. Project Architecture](#6-project-architecture)
  - [High-Level System Architecture](#high-level-system-architecture)
  - [Frontend & Client Architecture](#frontend--client-architecture)
  - [Backend Architecture & Request Lifecycle](#backend-architecture--request-lifecycle)
  - [Authentication & Device Pairing Flow](#authentication--device-pairing-flow)
- [7. Project Structure](#7-project-structure)
- [8. Prerequisites](#8-prerequisites)
- [9. Installation and Setup Guide](#9-installation-and-setup-guide)
  - [Step 1: Clone Repository](#step-1-clone-repository)
  - [Step 2: Database Initialization](#step-2-database-initialization)
  - [Step 3: Backend API Server Configuration & Startup](#step-3-backend-api-server-configuration--startup)
  - [Step 4: Desktop Companion Application (Electron)](#step-4-desktop-companion-application-electron)
  - [Step 5: Mobile Application (React Native / Expo)](#step-5-mobile-application-react-native--expo)
  - [Step 6: Command Line Interface (CLI)](#step-6-command-line-interface-cli)
- [10. Environment Variables](#10-environment-variables)
- [11. Running the Project](#11-running-the-project)
- [12. API Documentation](#12-api-documentation)
  - [Authentication & Pairing Endpoints](#authentication--pairing-endpoints)
  - [Files Endpoints](#files-endpoints)
  - [Notes Endpoints](#notes-endpoints)
  - [Tasks Endpoints](#tasks-endpoints)
  - [Health & Diagnostics](#health--diagnostics)
- [13. Database Design](#13-database-design)
  - [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
  - [Table Specifications & Constraints](#table-specifications--constraints)
  - [Normalization & 3NF Proof](#normalization--3nf-proof)
  - [Pessimistic Concurrency Control (SELECT FOR UPDATE)](#pessimistic-concurrency-control-select-for-update)
  - [Indexing Strategy](#indexing-strategy)
- [14. Application Workflows](#14-application-workflows)
  - [Workflow 1: Device Pairing via QR Code Handshake](#workflow-1-device-pairing-via-qr-code-handshake)
  - [Workflow 2: End-to-End File Handoff with SHA-256 Validation](#workflow-2-end-to-end-file-handoff-with-sha-256-validation)
  - [Workflow 3: Real-Time Notes & Tasks Coordination](#workflow-3-real-time-notes--tasks-coordination)
- [15. Testing and Quality Assurance](#15-testing-and-quality-assurance)
- [16. Deployment Guide](#16-deployment-guide)
- [17. Team Members and Contributions](#17-team-members-and-contributions)
- [18. Challenges and Technical Decisions](#18-challenges-and-technical-decisions)
- [19. Known Limitations](#19-known-limitations)
- [20. Future Improvements & Roadmap](#20-future-improvements--roadmap)
- [21. Contributing Guidelines](#21-contributing-guidelines)
- [22. License](#22-license)
- [23. Acknowledgements and References](#23-acknowledgements-and-references)
- [24. Contact and Support](#24-contact-and-support)
- [25. Final Project Information](#25-final-project-information)

---

## 1. Project Banner and Introduction

**PocketBridge** is an open-source, local-first synchronization and peer-to-peer data bridge engineered to seamlessly move files, notes, and task action items between a smartphone and a workstation over a local Wi-Fi network.

In a computing landscape dominated by cloud services, moving a photo or a snippet of text between a phone and a computer resting on the same desk frequently requires uploading data to remote servers owned by Google, Apple, or Meta. PocketBridge restores the local area network (LAN) as the primary transport layer. It provides immediate, zero-cloud data transfers with zero internet bandwidth consumption, strict privacy boundaries, and verified cryptographic integrity.

**Target Audience:** Developers, students, security-conscious professionals, and off-grid users who require fast, private, and frictionless data exchange between mobile and desktop environments without third-party cloud intermediaries.

---

## 2. Project Overview

### The Problem It Solves
1. **Cloud Latency & Bandwidth Consumption:** Uploading multi-megabyte files to third-party cloud storage and downloading them back onto an adjacent machine wastes bandwidth and incurs unnecessary network latency.
2. **Privacy Vulnerabilities:** Transmitting private documents, API keys, or meeting minutes through cloud chat applications (WhatsApp, Telegram) or remote storage exposes private data to third-party retention and surveillance.
3. **Internet Dependency:** When working on airplanes, remote field sites, campus guest networks, or during internet service outages, cloud-dependent transfer mechanisms fail entirely.
4. **Ecosystem Silos:** AirDrop and Quick Share function effectively only when all devices belong to the same proprietary hardware or operating system ecosystem.

### Objectives & Capabilities
- **Direct LAN Communication:** Establish direct peer-to-peer communication over local Wi-Fi subnets using standard HTTP and REST protocols.
- **Cryptographic Ephemeral Pairing:** Eliminate manual network configuration through single-use 16-byte cryptographic QR codes with strict 5-minute timeouts.
- **Integrity-Verified File Handoff:** Support binary transfers up to 25MB per file with automatic SHA-256 checksum generation and validation.
- **Relational Data Management:** Persist client metadata, notes, tasks, and audit logs inside a strictly normalized (3NF/BCNF) PostgreSQL relational database.
- **Multi-Client Surface:** Interface seamlessly across mobile (React Native/Expo), desktop (Electron), and headless terminal environments (Node.js CLI).

---

## 3. Key Features

### 🔐 Zero-Configuration Device Pairing
- **Dynamic QR Code Generation:** Desktop client renders a 2D QR payload embedding the local server LAN address and an ephemeral 16-byte hex token.
- **Atomic Concurrency Protection:** Pairing consumption is executed inside a PostgreSQL database transaction utilizing pessimistic row locks (`SELECT ... FOR UPDATE`), preventing token reuse or race conditions when multiple devices attempt pairing concurrently.
- **Device-Bound JWT Security:** Successful pairing issues a long-lived JWT containing both `userId` and `deviceId` claims, enabling revocable per-device authentication.

### ⚡ Line-Speed LAN File Transfers
- **High-Throughput Streaming:** Leverages `multer` streaming directly to disk under `server/storage/`, bypassing memory buffer saturation.
- **Strict Domain Constraints:** Database-level `CHECK` constraint enforces a 25MB maximum file size limit (`size_bytes > 0 AND size_bytes <= 26214400`).
- **Cryptographic Verification:** Automatically calculates and verifies a SHA-256 integrity checksum upon receipt, preventing corrupted or incomplete transfers.
- **Desktop Auto-Inbox:** Electron desktop companion continuously polls for received transfers, presenting immediate download links.

### 📝 Synchronized Notes & Snippets
- **Rapid Capture:** Create, read, and delete plain-text or markdown notes across paired devices.
- **Note Pinning:** Critical reference items can be pinned to remain anchored at the top of client views.
- **Device Attribution:** Every note maintains referential provenance to the specific physical device that created it.

### 📋 Prioritized Task Management
- **Status Lifecycle:** Tracks tasks across standard lifecycle phases: `todo`, `in_progress`, and `done` (validated by database check constraints).
- **Three-Tier Priority:** Supports `low`, `medium`, and `high` priority classifications.
- **Due Date Scheduling:** Tracks optional ISO timestamp deadlines with indexed composite lookup support.

### 💻 Tri-Client Ecosystem
- **Mobile Client (React Native / Expo):** Mobile interface with native camera barcode scanning, document picker, and secure credential storage.
- **Desktop Client (Electron):** Workstation dashboard displaying pairing QR codes, live received files, and connection status.
- **CLI Companion (Node.js):** Zero-dependency terminal utility for headless machines, CI scripts, and keyboard-driven developer synchronization.

---

## 4. Screenshots and Demo

### Architecture & Database Entity Relationship Map
The project incorporates a fully documented relational data model:

![PocketBridge Relational ER Diagram](db/er/er-diagram.png)  
*Figure 4.1: PocketBridge 3NF Entity Relationship Diagram showing relationships between Users, Devices, Pairing Codes, Notes, Tasks, Files, and Activity Logs.*

### Application Interfaces

```
+-------------------------------------------------------------------------+
| PocketBridge Desktop Companion (Electron)                               |
+-------------------+-----------------------------------------------------+
| [File Inbox] (o)  | Files Received From Mobile                          |
| [Device Pairing]  | +-----------------------+---------+---------------+ |
| [Notes & Tasks]   | | File Name             | Size    | Source Device | |
|                   | +-----------------------+---------+---------------+ |
|                   | | project_outline.pdf   | 1.0 MB  | Android Mobile| |
|                   | | mockup_diagram.png    | 512 KB  | Android Mobile| |
|                   | +-----------------------+---------+---------------+ |
+-------------------+-----------------------------------------------------+
```
*Figure 4.2: Diagrammatic view of the Electron Desktop companion received files inbox.*

```
+-------------------------------------------------------------------------+
| PocketBridge Mobile Client (React Native / Expo)                        |
+-------------------------------------------------------------------------+
| [ Pair with Desktop ]                                                   |
| Scan QR code on desktop or enter 32-char code:                          |
| [ a3f5b7c9e120...                               ]                       |
| [ SUBMIT PAIRING ]                                                      |
| ----------------------------------------------------------------------- |
| Active Tasks (Priority Order)                                           |
| [*] [HIGH] Setup PostgreSQL DB (DONE)                                   |
| [*] [HIGH] Implement Express Auth (DONE)                                |
| [ ] [MED]  Expo QR Scanner Flow (IN PROGRESS)                           |
+-------------------------------------------------------------------------+
```
*Figure 4.3: Diagrammatic view of Mobile pairing and prioritized task interface.*

> **Asset Placement Note:**  
> Standalone Android binaries are available in the repository root: [`PocketBridge_PRODUCTION.apk`](PocketBridge_PRODUCTION.apk).  
> To view the 10-minute presentation guide with demonstration code walkthroughs, see [`VIDEO_PRESENTATION_GUIDE.md`](VIDEO_PRESENTATION_GUIDE.md).

---

## 5. Technology Stack

### System Overview

| Domain | Technology | Version | Purpose & Usage in PocketBridge |
| :--- | :--- | :--- | :--- |
| **Database** | **PostgreSQL** | 14 / 16 / 18 | Primary relational storage, enforcing 3NF normalization, foreign key cascades, and check constraints. |
| **ORM / Migration**| **Prisma ORM** | 7.10.1 | Type-safe database schema modeling and query generation (`server/prisma/schema.prisma`). |
| **Database Driver** | **node-postgres (`pg`)** | 8.23.1 | High-throughput connection pooling (`pg.Pool`) executing raw SQL queries and atomic transactions. |
| **Backend Runtime** | **Node.js** | >= 18.0.0 | Asynchronous event-driven JavaScript runtime executing server and CLI components. |
| **Web Framework** | **Express.js** | 4.19.2 | RESTful HTTP routing, request parsing, and centralized error handling middleware. |
| **Authentication** | **jsonwebtoken** | 9.0.2 | Cryptographic signing and validation of stateless 30-day bearer JWT tokens. |
| **Password Security**| **Bcrypt** | 5.1.1 | 10-round salted password hashing preventing plaintext credential persistence. |
| **File Processing** | **Multer** | 1.4.5-lts.1 | Streaming multipart/form-data upload management enforcing disk storage and 25MB limits. |
| **Cryptography** | **Node.js Crypto** | Native | SHA-256 checksum generation for binary files and 16-byte random pairing entropy. |
| **Mobile Runtime** | **React Native** | 0.74.0 | Declarative mobile UI framework cross-compiling to native Android and iOS components. |
| **Mobile Toolchain**| **Expo SDK** | ~51.0.0 | Native API abstractions for mobile camera, filesystem, and secure device storage. |
| **Mobile Camera** | **expo-camera** | ~15.0.0 | Hardware barcode and QR scanning integration on physical smartphone devices. |
| **Document Access** | **expo-document-picker**| ~12.0.0 | Native OS file picker interface for selecting local documents and images. |
| **Mobile Storage** | **expo-secure-store** | ~13.0.0 | Encrypted on-device keychain/keystore storage for user JWTs. |
| **Desktop Runtime** | **Electron** | ^30.0.0 | Native cross-platform desktop wrapper combining Chromium and Node.js system access. |
| **QR Generation** | **qrcode** | ^1.5.3 | Client-side 2D barcode canvas generator for pairing payload presentation. |
| **CLI Runtime** | **Vanilla Node.js** | Native | Zero-dependency native HTTP client (`apps/cli/pocketbridge.js`). |

---

## 6. Project Architecture

### High-Level System Architecture

PocketBridge implements a **Hub-and-Spoke Local Network Topology**. The workstation acts as the local application host and storage server on the local Wi-Fi subnet (`0.0.0.0:4000`), servicing the local desktop companion, remote mobile devices, and command-line interfaces.

```mermaid
flowchart TB
    subgraph LAN["Local Area Network (Wi-Fi Subnet)"]
        subgraph Clients["Client Presentation Layer"]
            Mobile["📱 Mobile App (React Native / Expo 51)<br/>• Camera QR Scanner<br/>• File Picker<br/>• Secure Store"]
            Desktop["💻 Desktop Companion (Electron 30)<br/>• QR Renderer<br/>• Received Files Inbox<br/>• Auto-refreshing Poller"]
            CLI["⌨️ CLI Companion (Node.js)<br/>• Headless Terminal<br/>• Scriptable Sync"]
        end

        subgraph HostWorkstation["Workstation Server Host"]
            subgraph ExpressServer["Application & Business Logic Layer (Express.js)"]
                Router["HTTP Router (/api)"]
                AuthModule["Auth Module<br/>(Bcrypt, JWT)"]
                PairingModule["Pairing Module<br/>(Pessimistic Row Lock)"]
                FileModule["File Streaming Engine<br/>(Multer, SHA-256)"]
                NotesModule["Notes & Tasks Manager"]
                ErrHandler["Central Error Boundary"]
            end

            subgraph DataPersistence["Persistence & Storage Layer"]
                PGPool[("🐘 PostgreSQL RDBMS<br/>• 3NF Schema<br/>• CHECK Constraints<br/>• B-Tree Indexes")]
                DiskStorage["📁 Local Filesystem (/server/storage/)<br/>• UUID-Named Files<br/>• Max 25MB per file"]
            end
        end
    end

    Mobile <-->|HTTP / JSON & Multipart / Bearer JWT| Router
    Desktop <-->|HTTP / JSON / Bearer JWT| Router
    CLI <-->|HTTP / JSON / Bearer JWT| Router

    Router --> AuthModule
    Router --> PairingModule
    Router --> FileModule
    Router --> NotesModule
    Router --> ErrHandler

    PairingModule <-->|BEGIN ... SELECT FOR UPDATE ... COMMIT| PGPool
    AuthModule <-->|SQL Queries (pg.Pool)| PGPool
    NotesModule <-->|SQL Queries (pg.Pool)| PGPool
    FileModule -->|Write Binary Stream| DiskStorage
    FileModule <-->|Insert Metadata & SHA-256| PGPool
```

### Frontend & Client Architecture
- **Mobile (`apps/mobile`):**
  - **Component Structure:** `AuthScreen` handles registration, login, and direct server URL configuration. `PairingScreen` captures camera inputs or manual 32-character hex tokens. `HomeScreen` displays a tabbed interface organizing notes, tasks, and file upload pickers.
  - **Networking:** `services/api.js` wraps standard `fetch` with token injection, JSON header management, and error boundary handling.
- **Desktop (`apps/desktop`):**
  - **Architecture:** Electron main process (`main.js`) initializes a 900x700 native Chromium window running `index.html`.
  - **Renderer (`renderer.js`):** Polls the local API for newly arrived files, triggers QR generation via the `qrcode` library, and opens local browser downloads.
- **CLI (`apps/cli`):**
  - **Architecture:** A self-contained script (`pocketbridge.js`) utilizing Node.js native `http` module. Maintains session tokens inside a local `.pocketbridge-config.json` configuration file.

### Backend Architecture & Request Lifecycle

```mermaid
sequenceDiagram
    autonumber
    actor Client as Mobile / Desktop Client
    participant API as Express API Router
    participant MW as requireAuth Middleware
    participant Controller as Module Controller
    participant DB as PostgreSQL (pg.Pool)
    participant Disk as Filesystem Storage

    Client->>API: HTTP Request + Bearer JWT
    API->>MW: Validate Authorization Header
    MW->>MW: Verify JWT Signature (jsonwebtoken)
    MW->>DB: Verify active device in database
    alt Device Revoked or Token Invalid
        MW-->>Client: 401 Unauthorized
    else Authentication Verified
        MW->>Controller: Forward req.user & req.device
        alt Multipart File Upload
            Controller->>Disk: Stream binary via Multer
            Controller->>Controller: Compute SHA-256 Checksum
            Controller->>DB: INSERT file metadata & checksum
        else Relational Query / Task
            Controller->>DB: Execute parameterized query ($1, $2)
        end
        DB-->>Controller: Return query result
        Controller-->>Client: 200 / 201 JSON Response
    end
```

### Authentication & Device Pairing Flow

```mermaid
sequenceDiagram
    autonumber
    actor Desktop as Desktop Host
    actor Mobile as Mobile Companion
    participant API as Express API Server
    participant DB as PostgreSQL Database

    Desktop->>API: POST /api/pairings (Bearer JWT)
    API->>API: Generate 16-byte random hex code & SHA-256 hash
    API->>DB: INSERT into pairing_codes (expires_at = NOW() + 5m)
    API-->>Desktop: Return raw code & QR payload
    Desktop->>Desktop: Display QR Code on Screen
    
    Mobile->>Mobile: Scan QR Code via Expo Camera
    Mobile->>API: POST /api/pairings/consume (rawCode, deviceName, platform)
    
    Note over API,DB: Begin ACID Transaction with Row-Level Lock
    API->>DB: BEGIN TRANSACTION
    API->>DB: SELECT * FROM pairing_codes WHERE code_hash = $1 FOR UPDATE
    
    alt Code Expired or used_at IS NOT NULL
        API->>DB: ROLLBACK
        API-->>Mobile: 400 Expired / 409 Already Consumed
    else Code Valid & Unused
        API->>DB: INSERT INTO devices (user_id, device_name, platform)
        API->>DB: UPDATE pairing_codes SET used_at = NOW(), consumed_by_device_id = $dev_id
        API->>DB: COMMIT TRANSACTION
        API->>API: Sign 30-day JWT with { userId, deviceId }
        API-->>Mobile: 200 OK + Device JWT
    end
```

---

## 7. Project Structure

A clean, annotated representation of the entire PocketBridge repository:

```text
pocketbridge/
├── PocketBridge.apk                    # Pre-built testing Android APK build
├── PocketBridge_FINAL.apk              # Stable milestone Android release APK
├── PocketBridge_FINAL_FIXED.apk        # Bugfix milestone Android release APK
├── PocketBridge_PRODUCTION.apk         # Verified production-ready standalone Android APK
├── PocketBridge_v2.apk                 # Iteration milestone Android APK
├── VIDEO_PRESENTATION_GUIDE.md         # 10-minute presentation guide with demonstration code
├── README.md                           # Master project documentation
│
├── apps/                               # Client application surfaces
│   ├── README.md                       # Overview of client applications
│   ├── mobile/                         # React Native / Expo Mobile Application
│   │   ├── package.json                # Dependencies: expo, expo-camera, react-native
│   │   └── src/
│   │       ├── screens/                # UI Screens: AuthScreen, HomeScreen, PairingScreen
│   │       └── services/               # API abstraction (api.js) and token injector
│   ├── desktop/                        # Electron Desktop Companion
│   │   ├── package.json                # Dependencies: electron, qrcode
│   │   ├── main.js                     # Electron main process & BrowserWindow management
│   │   ├── index.html                  # Desktop dashboard layout & CSS
│   │   └── renderer.js                 # UI interactions, pairing QR trigger, inbox poller
│   └── cli/                            # Headless Terminal Command-Line Tool
│       ├── package.json                # CLI package metadata
│       └── pocketbridge.js             # Native Node.js CLI script (status, tasks, files, notes)
│
├── server/                             # Express REST API Backend
│   ├── package.json                    # Dependencies: express, pg, bcrypt, jsonwebtoken, multer
│   ├── .env                            # Active environment configuration (gitignored in production)
│   ├── storage/                        # Physical directory for received binary file streams
│   ├── prisma/
│   │   └── schema.prisma               # Prisma ORM relational schema specification
│   ├── tests/
│   │   └── api.test.js                 # API route and middleware smoke test suite
│   └── src/
│       ├── server.js                   # Process entry point & port listener (0.0.0.0:4000)
│       ├── app.js                      # Express middleware setup, CORS, route mounting
│       ├── db.js                       # PostgreSQL connection pool configuration (pg.Pool)
│       ├── middleware/
│       │   ├── auth.js                 # JWT bearer token verification & device validation
│       │   └── errorHandler.js         # Centralized HTTP error response formatter
│       ├── modules/                    # Domain-driven route controllers
│       │   ├── auth/                   # POST /register, POST /login
│       │   ├── pairing/                # POST /pairings, POST /pairings/consume
│       │   ├── files/                  # POST /files, GET /files, GET /files/:id/download
│       │   ├── notes/                  # GET /notes, POST /notes, DELETE /notes/:id
│       │   └── tasks/                  # GET /tasks, POST /tasks, PATCH /tasks/:id
│       └── utils/
│           └── security.js             # Bcrypt hashing and JWT signing wrappers
│
├── db/                                 # Database Architecture & Engineering Suite
│   ├── schema.sql                      # Complete PostgreSQL DDL (3NF, CHECK constraints, indexes)
│   ├── seeds/
│   │   └── seed.sql                    # Initial seed dataset (users, devices, tasks, files)
│   ├── queries/
│   │   └── reports.sql                 # Analytical aggregation and reporting queries
│   ├── tests/
│   │   └── integrity-test.sql          # PL/pgSQL automated constraint and rejection test suite
│   ├── er/
│   │   ├── er-diagram.mmd              # Mermaid ER diagram source definition
│   │   └── er-diagram.png              # Rendered graphical Entity Relationship diagram
│   └── docs/                           # Technical Database Architecture Reports
│       ├── data-dictionary.md          # Full attribute dictionary (types, nullability, descriptions)
│       ├── normalization-3nf.md        # 1NF/2NF/3NF formal mathematical normalization proof
│       ├── acid-concurrency.md         # Pessimistic row-locking concurrency documentation
│       └── indexes-and-constraints.md  # Comprehensive index catalog & check constraints
│
└── docs/                               # Project Governance & Academic Documentation
    ├── api-contract.md                 # Detailed API contract specification
    └── contributions/                  # Individual team member subject contributions
        ├── mahin-de.md                 # Data Engineering (DE) Lead contribution report
        ├── kunal-asd.md                # Applied Software Development (ASD) report
        └── shekhar-isd.md              # Interactive Systems Development (ISD) report
```

---

## 8. Prerequisites

To execute and test PocketBridge locally, ensure your development environment satisfies:

| Dependency | Minimum Version | Verified Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Node.js** | `>= 18.0.0` | `v18.x` / `v20.x` | Runtime for API server, Electron, Expo CLI, and CLI tool. |
| **npm** | `>= 9.0.0` | `v10.x` | Package manager for dependency resolution and scripts. |
| **PostgreSQL** | `>= 14.0` | `16.x` / `18.x` | Relational database engine supporting `uuid-ossp` and row locks. |
| **Expo Go** | `v51.x` | `v51.0.0` | Mobile client runner on physical Android or iOS devices. |
| **Git** | `>= 2.30.0` | Native | Version control system. |

---

## 9. Installation and Setup Guide

Follow this sequential procedure to initialize the full stack from source.

### Step 1: Clone Repository
```bash
git clone https://github.com/mahinpatel/pocketbridge.git
cd pocketbridge
```

### Step 2: Database Initialization

1. Verify that your local PostgreSQL service is running:
```bash
# macOS (Homebrew)
brew services start postgresql@16

# Linux (systemd)
sudo systemctl start postgresql
```

2. Create the `pocketbridge` database, then apply the relational schema and seeds:
```bash
# 1. Create database
createdb pocketbridge

# 2. Execute 3NF DDL schema, constraints, and indexes
psql -d pocketbridge -f db/schema.sql

# 3. Insert baseline demo seed data
psql -d pocketbridge -f db/seeds/seed.sql
```

3. Verify that all 7 tables exist:
```bash
psql -d pocketbridge -c "\dt"
```
*Expected tables:* `activity_logs`, `devices`, `files`, `notes`, `pairing_codes`, `tasks`, `users`.

---

### Step 3: Backend API Server Configuration & Startup

1. Navigate to the `server/` directory and install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables. Create or update `server/.env`:
```bash
cat <<EOF > .env
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pocketbridge
JWT_SECRET=pocketbridge_local_development_secret_key_2026
EOF
```
*(Adjust the username, password, or port in `DATABASE_URL` to match your local PostgreSQL credentials).*

3. Start the API server:
```bash
# Run in standard production mode
npm start

# OR run with active hot-reload during development
npm run dev
```
*Console output will display:*  
`PocketBridge Server running on http://0.0.0.0:4000`

4. Verify health status in another terminal:
```bash
curl http://localhost:4000/api/health
# Response: {"status":"ok","service":"pocketbridge-api","timestamp":"..."}
```

---

### Step 4: Desktop Companion Application (Electron)

1. Open a new terminal tab and navigate to `apps/desktop`:
```bash
cd apps/desktop
npm install
```

2. Launch the desktop companion:
```bash
npm start
```
The Electron desktop window will initialize, offering:
- File inbox monitoring received files.
- Instant Pairing tab for generating new mobile invitation QR codes.

---

### Step 5: Mobile Application (React Native / Expo)

1. Open a new terminal tab and navigate to `apps/mobile`:
```bash
cd apps/mobile
npm install
```

2. Start the Expo development server:
```bash
npx expo start
```

3. **Connecting a Physical Device:**
   - Ensure your phone and laptop are connected to the **same local Wi-Fi network**.
   - Open the **Expo Go** application on your device.
   - Scan the Metro bundler QR code presented in your terminal.
   - On the Mobile Auth screen, configure the server IP to match your laptop's local LAN address (e.g., `http://192.168.1.15:4000/api`).
   - *Alternative:* You can install the pre-built APK directly onto an Android device via `adb install PocketBridge_PRODUCTION.apk`.

---

### Step 6: Command Line Interface (CLI)

1. Navigate to `apps/cli`:
```bash
cd apps/cli
```

2. Verify connectivity using the CLI:
```bash
node pocketbridge.js status
```
*Output:* `[OK] PocketBridge API Status: ok | Service: pocketbridge-api`

---

## 10. Environment Variables

All backend server configurations are controlled through environment variables located in `server/.env`:

| Variable | Description | Required | Default / Safe Example |
| :--- | :--- | :--- | :--- |
| `PORT` | Network port the Express server binds to on `0.0.0.0`. | **No** (Defaults to 4000) | `4000` |
| `DATABASE_URL`| PostgreSQL connection URI specifying credentials, host, port, and database. | **Yes** | `postgresql://postgres:postgres@localhost:5432/pocketbridge` |
| `JWT_SECRET` | Secret key used for cryptographic signing of 30-day bearer JWT tokens. | **No** (Has fallback) | `pocketbridge-secret-key-change-in-prod` |

> **Security Mandate:** Never commit production database passwords or JWT signing secrets to source control. Ensure `server/.env` remains listed in `.gitignore`.

---

## 11. Running the Project

### Summary of Executable Scripts

#### 1. Backend Server (`server/`)
```bash
cd server
npm start       # Executes: node src/server.js
npm run dev     # Executes: node --watch src/server.js (auto-restart on changes)
npm test        # Executes: node tests/api.test.js (smoke test suite)
```

#### 2. Desktop Companion (`apps/desktop/`)
```bash
cd apps/desktop
npm start       # Executes: electron . (launches desktop window)
npm run build   # Executes: vite build (production asset packaging)
```

#### 3. Mobile Client (`apps/mobile/`)
```bash
cd apps/mobile
npm start       # Executes: expo start (starts Metro bundler)
npm run android # Executes: expo start --android (opens connected Android device/emulator)
npm run ios     # Executes: expo start --ios (opens iOS simulator)
```

#### 4. Command Line Tool (`apps/cli/`)
```bash
cd apps/cli
node pocketbridge.js status           # Health check
node pocketbridge.js set-token <JWT>  # Saves bearer token to .pocketbridge-config.json
node pocketbridge.js tasks list       # Displays task list with completion and priority
node pocketbridge.js files list       # Displays received files and source devices
node pocketbridge.js notes add <msg>  # Rapidly creates a new note
```

---

## 12. API Documentation

Base URL: `http://<server-ip>:4000/api`  
Standard Response Format: `application/json`  
Authentication: `Authorization: Bearer <JWT_TOKEN>`

### Authentication & Pairing Endpoints

#### `POST /auth/register`
- **Access:** Public
- **Description:** Registers a new account owner and associates the initial host device.
- **Request Body:**
  ```json
  {
    "email": "shekhar@pocketbridge.local",
    "password": "Password123!",
    "fullName": "Shekhar Jadhav",
    "deviceName": "MacBook Pro Host",
    "platform": "desktop"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "11111111-1111-1111-1111-111111111111",
      "name": "Shekhar Jadhav",
      "email": "shekhar@pocketbridge.local"
    },
    "device": {
      "id": "aaaa1111-aaaa-1111-aaaa-111111111111",
      "name": "MacBook Pro Host",
      "platform": "desktop"
    }
  }
  ```

#### `POST /auth/login`
- **Access:** Public
- **Description:** Verifies credentials and generates a device-authenticated JWT.
- **Request Body:**
  ```json
  {
    "email": "shekhar@pocketbridge.local",
    "password": "Password123!",
    "deviceName": "MacBook Pro Host",
    "platform": "desktop"
  }
  ```
- **Response (200 OK):** Identical shape to `/auth/register`.

#### `POST /pairings`
- **Access:** Protected (`requireAuth`)
- **Description:** Generates an ephemeral 16-byte random hex code and QR code payload valid for 5 minutes.
- **Response (201 Created):**
  ```json
  {
    "code": "e8a946e31e5e54d8b9f71c4293f0b1aa",
    "expiresAt": "2026-11-23T10:05:00.000Z",
    "qrPayload": "{\"code\":\"e8a946e31e5e54d8b9f71c4293f0b1aa\",\"serverUrl\":\"http://192.168.1.15:4000/api\"}"
  }
  ```

#### `POST /pairings/consume`
- **Access:** Public (Pre-authenticated)
- **Description:** Atomically consumes an active pairing code using row locks, registers the client device, and issues a JWT.
- **Request Body:**
  ```json
  {
    "code": "e8a946e31e5e54d8b9f71c4293f0b1aa",
    "deviceName": "Shekhar Android",
    "platform": "android"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "device": {
      "device_id": "bbbb2222-bbbb-2222-bbbb-222222222222",
      "device_name": "Shekhar Android",
      "platform": "android"
    },
    "message": "Device successfully paired"
  }
  ```
- **Error Codes:**
  - `400 CODE_EXPIRED`: Code validity window exceeded.
  - `404 NOT_FOUND`: Unrecognized token.
  - `409 CODE_ALREADY_USED`: Token has already been consumed.

---

### Files Endpoints

#### `POST /files`
- **Access:** Protected (`requireAuth`)
- **Headers:** `Content-Type: multipart/form-data`
- **Body:** `file: <binary-stream>`
- **Description:** Streams file to disk storage, computes SHA-256 hash, and inserts database record.
- **Response (201 Created):**
  ```json
  {
    "file_id": "f1111111-0000-0000-0000-000000000001",
    "original_name": "project_outline.pdf",
    "size_bytes": "1048576",
    "mime_type": "application/pdf",
    "created_at": "2026-11-23T00:00:00.000Z",
    "status": "stored"
  }
  ```

#### `GET /files`
- **Access:** Protected (`requireAuth`)
- **Description:** Retrieves metadata for all stored files originating from any device owned by the authenticated user.
- **Response (200 OK):**
  ```json
  [
    {
      "file_id": "f1111111-0000-0000-0000-000000000001",
      "original_name": "project_outline.pdf",
      "mime_type": "application/pdf",
      "size_bytes": "1048576",
      "checksum_sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "created_at": "2026-11-23T00:00:00.000Z",
      "status": "stored",
      "source_device_name": "Android Companion"
    }
  ]
  ```

#### `GET /files/:id/download`
- **Access:** Protected (`requireAuth`)
- **Description:** Streams binary bytes from disk with `Content-Disposition: attachment` header. Verifies user ownership before streaming.
- **Error Codes:** `403 FORBIDDEN` (file belongs to another user), `404 NOT_FOUND` (file record missing).

---

### Notes Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/notes` | Protected | Returns notes for user account, sorted with pinned notes first (`is_pinned DESC, updated_at DESC`). |
| `POST` | `/notes` | Protected | Creates new note (`{ title, body, isPinned? }`). |
| `DELETE` | `/notes/:id` | Protected | Deletes specified note if owned by user's devices. |

---

### Tasks Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks` | Protected | Returns user tasks ordered by priority (`high` $\to$ `medium` $\to$ `low`) and creation date. |
| `POST` | `/tasks` | Protected | Creates a task (`{ title, description?, priority?, status?, dueAt? }`). |
| `PATCH` | `/tasks/:id` | Protected | Updates `status` (`todo`, `in_progress`, `done`) or `priority` (`low`, `medium`, `high`). |

---

### Health & Diagnostics

#### `GET /health`
- **Access:** Public
- **Response (200 OK):**
  ```json
  {
    "status": "ok",
    "service": "pocketbridge-api",
    "timestamp": "2026-11-23T00:26:44.000Z"
  }
  ```

---

## 13. Database Design

### Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ devices : "owns (1:N)"
    devices ||--o{ pairing_codes : "creates (1:N)"
    devices ||--o{ notes : "writes (1:N)"
    devices ||--o{ tasks : "assigns (1:N)"
    devices ||--o{ files : "uploads (1:N)"
    devices ||--o{ activity_logs : "triggers (1:N)"

    users {
        uuid user_id PK
        string full_name
        string email UK
        string password_hash
        timestamp created_at
    }

    devices {
        uuid device_id PK
        uuid user_id FK
        string device_name
        string platform
        boolean is_active
        timestamp last_seen_at
        timestamp created_at
    }

    pairing_codes {
        uuid pairing_id PK
        uuid created_by_device_id FK
        uuid consumed_by_device_id FK
        string code_hash UK
        timestamp expires_at
        timestamp used_at
        timestamp created_at
    }

    notes {
        uuid note_id PK
        uuid device_id FK
        string title
        string body
        boolean is_pinned
        timestamp created_at
        timestamp updated_at
    }

    tasks {
        uuid task_id PK
        uuid device_id FK
        string title
        string description
        string priority
        string status
        timestamp due_at
        timestamp created_at
        timestamp updated_at
    }

    files {
        uuid file_id PK
        uuid source_device_id FK
        uuid target_device_id FK
        string original_name
        string storage_key UK
        string mime_type
        bigint size_bytes
        string checksum_sha256
        string direction
        string status
        timestamp created_at
    }

    activity_logs {
        uuid activity_id PK
        uuid device_id FK
        string action_type
        string target_type
        string target_id
        timestamp created_at
    }
```

### Table Specifications & Constraints

- **`users`**: Surrogate key `user_id` (UUID). Lowercase unique constraint on `email`. Bcrypt hashed `password_hash`.
- **`devices`**: Surrogate key `device_id` (UUID). `user_id` foreign key referencing `users(user_id) ON DELETE RESTRICT`. `chk_devices_platform CHECK (platform IN ('android', 'ios', 'desktop', 'cli'))`.
- **`pairing_codes`**: Surrogate key `pairing_id` (UUID). `created_by_device_id` references `devices(device_id) ON DELETE CASCADE`. `consumed_by_device_id` references `devices(device_id) ON DELETE SET NULL`. Unique `code_hash`.
- **`notes`**: Surrogate key `note_id` (UUID). Foreign key `device_id` referencing `devices(device_id) ON DELETE RESTRICT`.
- **`tasks`**: Surrogate key `task_id` (UUID). `chk_tasks_priority CHECK (priority IN ('low', 'medium', 'high'))`. `chk_tasks_status CHECK (status IN ('todo', 'in_progress', 'done'))`.
- **`files`**: Surrogate key `file_id` (UUID). Unique `storage_key`. Hard byte size check: `chk_files_size CHECK (size_bytes > 0 AND size_bytes <= 26214400)`. Direction check: `chk_files_direction CHECK (direction IN ('to_desktop', 'to_mobile'))`. Status check: `chk_files_status CHECK (status IN ('stored', 'deleted', 'failed'))`.
- **`activity_logs`**: Surrogate key `activity_id` (UUID). Foreign key `device_id` referencing `devices(device_id) ON DELETE CASCADE`.

### Normalization & 3NF Proof

1. **1NF (First Normal Form):** Every column contains indivisible atomic values. No repeating groups or array attributes exist. Every table defines an explicit primary key (`UUID DEFAULT uuid_generate_v4()`).
2. **2NF (Second Normal Form):** The schema satisfies 1NF. All primary keys are single-column surrogate keys. Consequently, partial functional dependencies on composite candidate keys are mathematically impossible.
3. **3NF (Third Normal Form):** The schema satisfies 2NF and contains no transitive functional dependencies ($X \to Y \to Z$ where $Y$ is not a superkey).
   - *Proof in Practice:* Tables such as `notes`, `tasks`, and `files` record **only `device_id`**, NOT `user_id`. Storing `user_id` directly in `notes` would establish a transitive dependency:  
     $$\text{note\_id} \to \text{device\_id} \quad \text{and} \quad \text{device\_id} \to \text{user\_id} \implies \text{note\_id} \to \text{user\_id}$$
     Resolving ownership via relational join (`notes.device_id -> devices.device_id -> devices.user_id`) satisfies 3NF and eliminates update anomalies.
4. **Decoupled Binary Storage:** Pure relational doctrine suggests storing file streams inside the database via `BYTEA` or `BLOB`. PocketBridge intentionally denormalizes physical binary storage to disk (`server/storage/`) to protect the PostgreSQL shared buffer pool from cache pollution during large file transfers. Only metadata and SHA-256 integrity hashes are persisted in the database.

### Pessimistic Concurrency Control (`SELECT FOR UPDATE`)

To prevent race conditions during device pairing, PocketBridge enforces pessimistic row-level locking:

```sql
BEGIN;
SELECT pairing_id, created_by_device_id, expires_at, used_at 
FROM pairing_codes 
WHERE code_hash = $1 
FOR UPDATE;

-- Transaction updates pairing record and commits:
UPDATE pairing_codes 
SET used_at = CURRENT_TIMESTAMP, consumed_by_device_id = $new_device_id 
WHERE pairing_id = $pairing_id;
COMMIT;
```

### Indexing Strategy

Targeted B-Tree indexes maintain $O(\log N)$ query performance across frequent execution paths:

```sql
CREATE UNIQUE INDEX idx_users_email ON users (email);
CREATE INDEX idx_devices_user_active ON devices (user_id, is_active);
CREATE INDEX idx_pairing_codes_expiry ON pairing_codes (expires_at);
CREATE INDEX idx_notes_device_updated ON notes (device_id, updated_at DESC);
CREATE INDEX idx_tasks_device_status_due ON tasks (device_id, status, due_at);
CREATE INDEX idx_files_source_created ON files (source_device_id, created_at DESC);
CREATE INDEX idx_activity_device_created ON activity_logs (device_id, created_at DESC);
```

---

## 14. Application Workflows

### Workflow 1: Device Pairing via QR Code Handshake

```mermaid
flowchart TD
    Start["Desktop User clicks 'Pair New Device'"] --> GenToken["Server generates 16-byte cryptographically secure random token"]
    GenToken --> HashToken["Server hashes token with SHA-256 and stores in pairing_codes with 5-min TTL"]
    HashToken --> RenderQR["Desktop renders 2D QR Code containing token & LAN IP"]
    RenderQR --> PhoneScan["Mobile user points camera at desktop screen"]
    PhoneScan --> SubmitPair["Mobile client posts token to /api/pairings/consume"]
    SubmitPair --> LockRow["PostgreSQL acquires row lock via SELECT FOR UPDATE"]
    LockRow --> CheckState{"Is token expired or used?"}
    CheckState -- Yes --> Abort["Rollback transaction and return HTTP 400/409"]
    CheckState -- No --> InsertDev["Insert new record into devices table"]
    InsertDev --> MarkUsed["Update pairing_codes: set used_at = NOW()"]
    MarkUsed --> CommitTx["Commit transaction and sign 30-day device JWT"]
    CommitTx --> Ready["Mobile stores token in SecureStore; devices are linked"]
```

### Workflow 2: End-to-End File Handoff with SHA-256 Validation

1. **Selection:** User opens Mobile App and chooses a photo or document via `expo-document-picker`.
2. **Stream Transmission:** Mobile client issues a multipart POST request to `/api/files`.
3. **Disk Write:** Multer streams binary bytes directly to `server/storage/<uuid>_<filename>`.
4. **Checksum Calculation:** Server reads streamed bytes, calculates a SHA-256 digest, and validates that size $\le 25\text{MB}$.
5. **Relational Record:** Server writes metadata record to `files` table (`original_name`, `storage_key`, `size_bytes`, `checksum_sha256`, `direction = 'to_desktop'`).
6. **Desktop Notification:** Desktop Electron companion polls `/api/files`, observes the new record, and renders a download button.
7. **Download Verification:** User clicks download; server validates user ownership and streams file back with `Content-Disposition`.

### Workflow 3: Real-Time Notes & Tasks Coordination

1. Mobile client creates a task with priority `high` and title `"Submit Project Report"`.
2. Server validates input and executes `INSERT INTO tasks (device_id, title, priority, status) VALUES ($1, $2, 'high', 'todo')`.
3. Workstation developer runs `node pocketbridge.js tasks list` in CLI.
4. CLI fetches tasks using join query:
   ```sql
   SELECT t.title, t.priority, t.status 
   FROM tasks t JOIN devices d ON t.device_id = d.device_id 
   WHERE d.user_id = $1 
   ORDER BY CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END;
   ```
5. Task displays in terminal: `[TODO] Submit Project Report (Priority: high)`.

---

## 15. Testing and Quality Assurance

PocketBridge includes automated tests across database integrity, concurrency, and API routing.

### 1. Database Integrity Test Suite
Execute the PL/pgSQL integrity test suite in PostgreSQL:
```bash
psql -d pocketbridge -f db/tests/integrity-test.sql
```
*Coverage:*
- Rejection of duplicate email addresses (`unique_violation` error 23505).
- Rejection of invalid task statuses (`check_violation` error 23514).

### 2. Concurrency & Race-Condition Test
Simulate simultaneous pairing consumption requests as documented in [`db/docs/acid-concurrency.md`](db/docs/acid-concurrency.md):
- **Request 1:** Acquires row lock, validates token, registers device $\to$ `200 OK`.
- **Request 2:** Blocks until Request 1 commits, detects `used_at IS NOT NULL` $\to$ `409 Conflict`.
- **Result:** Exactly 1 device created; zero orphaned records.

### 3. API Smoke Test Suite
Run the Express backend route and middleware test suite:
```bash
cd server
npm test
```
*Coverage:* Verifies Express bootstrap, router mounting (`/auth`, `/pairings`, `/files`, `/notes`, `/tasks`), and error boundary middleware attachment.

### 4. Analytical Reporting Queries
Validate data aggregation and reporting:
```bash
psql -d pocketbridge -f db/queries/reports.sql
```
- Report 1: Task summary grouped by user and completion status.
- Report 2: Daily file transfer history with total megabytes transferred.
- Report 3: Active devices and activity log summary.

---

## 16. Deployment Guide

### Local LAN Workstation Deployment (Recommended)

1. **Firewall Rules:** Allow incoming TCP connections on port `4000`:
   ```bash
   # macOS Firewall: Ensure node is allowed to accept incoming connections
   # Linux (UFW):
   sudo ufw allow 4000/tcp
   ```
2. **Process Management (PM2):** Run the backend server continuously as a daemon:
   ```bash
   npm install -g pm2
   cd server
   pm2 start src/server.js --name "pocketbridge-api"
   pm2 save
   ```
3. **Android Client Distribution:**  
   Install the pre-compiled Android release build directly onto test phones:
   ```bash
   adb install PocketBridge_PRODUCTION.apk
   ```

---

## 17. Team Members and Contributions

PocketBridge was developed collaboratively across three core software disciplines: **Data Engineering (DE)**, **Applied Software Development (ASD)**, and **Interactive Systems Development (ISD)**.

### Team Contribution Matrix

| Team Member | Primary Discipline | Primary Responsibilities & Core Deliverables | Cross-Discipline Contributions |
| :--- | :--- | :--- | :--- |
| **Mahin Patel** | **Lead: Data Engineering (DE)** | • Architected 7-table 3NF/BCNF relational model in PostgreSQL (`db/schema.sql`).<br>• Authored 3NF Normalization justification and functional dependency proofs.<br>• Designed domain `CHECK` constraints, composite B-Tree indexes, and FK rules.<br>• Implemented ACID transaction & `SELECT ... FOR UPDATE` row-locking proof for device pairing.<br>• Formulated analytical SQL queries (`reports.sql`) and DB connection pooling (`db.js`). | **In ASD (Backend):** Collaborated on `pg.Pool` transactions and rollback error handling.<br>**In ISD (Frontend):** Tested Electron desktop file lists against database row insertions. |
| **Kunal Kumar Jha** | **Lead: Backend & APIs (ASD)** | • Bootstrapped Node.js + Express backend server architecture and modular controllers.<br>• Built authentication system using `bcrypt` password hashing and signed JWT tokens.<br>• Developed pairing endpoints with 5-minute expiries and atomic consumption locks.<br>• Implemented file streaming upload/download service using `multer` with 25MB cap and SHA-256 verification.<br>• Authored API contract specifications in `docs/api-contract.md`. | **In DE (Database):** Reviewed SQL constraints and built Prisma schema mirroring tables.<br>**In ISD (Frontend):** Assisted with multipart/form-data boundary handling on mobile. |
| **Shekhar Jadhav** | **Lead: Client Applications (ISD)** | • Built React Native / Expo mobile app screens (Auth, Home dashboard, QR pairing view).<br>• Implemented file upload flow from phone using document picker and progress handling.<br>• Built Electron desktop companion app with received files inbox and QR code display.<br>• Developed lightweight Node.js terminal CLI (`pocketbridge.js`) with status and task commands.<br>• Handled UI edge cases: empty states, loading indicators, and local LAN IP configuration. | **In DE (Database):** Created realistic demo seed data (`db/seeds/seed.sql`).<br>**In ASD (Backend):** Authored API test suite (`server/tests/api.test.js`) verifying routing and error responses. |

---

## 18. Challenges and Technical Decisions

### 1. Concurrency Conflict in Device Pairing
- **Challenge:** Multiple rapid HTTP requests scanning a pairing QR code could read `used_at IS NULL` simultaneously, causing duplicate device entries.
- **Decision:** Implemented **pessimistic row-level locking (`SELECT ... FOR UPDATE`)** inside a PostgreSQL ACID transaction. The first request locks the row exclusively; the second request waits and is rejected with `409 Conflict` once the lock releases.

### 2. Filesystem vs. Database BLOB Storage
- **Challenge:** Storing binary files inside PostgreSQL (`BYTEA`) causes table page bloat and degrades database memory cache efficiency.
- **Decision:** Decoupled storage into a **hybrid architecture**. Binary payloads are stored on the local filesystem (`server/storage/`) indexed by UUID storage keys. PostgreSQL persists only metadata, MIME types, and SHA-256 checksums.

### 3. Normalization Trade-Offs & Transitive Dependency Elimination
- **Challenge:** Denormalizing `user_id` into `notes`, `tasks`, and `files` would allow single-table lookups but violates 3NF by introducing transitive dependencies (`note_id -> device_id -> user_id`).
- **Decision:** Strictly removed `user_id` from item tables. All ownership is resolved via relational joins through `devices`. Combined with composite B-Tree indexes on `(device_id, updated_at DESC)`, query performance remains $O(\log N)$ while maintaining complete normalization.

---

## 19. Known Limitations

1. **Same-Subnet Network Boundary:** Devices must reside on the same Wi-Fi subnet or local network segment. Transfers across isolated VLANs or carrier cellular data are not supported without VPN tunneling.
2. **Local Storage Scalability:** The host storage engine uses the local desktop filesystem (`server/storage/`). Disk usage must be monitored manually as automated quota pruning is not yet implemented.
3. **Manual Host IP Configuration:** If the host machine's Wi-Fi router reassigns local DHCP IP addresses, client configurations must be updated to the new host IP. (ZeroConf/mDNS auto-discovery is currently a planned roadmap feature).
4. **Client Polling:** File inbox refresh in the desktop client and mobile app relies on periodic HTTP polling rather than bi-directional persistent WebSockets.

---

## 20. Future Improvements & Roadmap

### Documented / Planned Improvements
- [ ] **mDNS / ZeroConf Automatic Discovery:** Implement Bonjour / Avahi local multicast DNS discovery so mobile clients automatically detect the desktop server without manual IP entry.
- [ ] **WebSocket Real-Time Event Push:** Replace client polling with bi-directional WebSocket or Server-Sent Events (SSE) for instantaneous file arrival alerts.
- [ ] **End-to-End Cryptographic Encryption (E2EE):** Incorporate WebCrypto AES-GCM encryption with client-side key exchange so file streams are encrypted before leaving the mobile device.

### Suggested Scalability Enhancements
- [ ] **PgBouncer Connection Pooling:** Introduce PgBouncer in transaction pooling mode to scale to thousands of concurrent client connections.
- [ ] **S3-Compatible Cloud Storage Engine:** Provide an interchangeable storage adapter (MinIO / AWS S3) for large-scale institutional deployments.
- [ ] **Chunked Resumable Transfers:** Integrate tus.io protocol for pausing and resuming large file transfers over unstable Wi-Fi.

---

## 21. Contributing Guidelines

We welcome contributions, bug reports, and suggestions from the developer community.

1. **Fork the Repository** on GitHub.
2. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Ensure Code Quality & Test Compliance:**
   - Run the database integrity suite: `psql -d pocketbridge -f db/tests/integrity-test.sql`.
   - Run backend tests: `cd server && npm test`.
4. **Commit Your Changes:**
   ```bash
   git commit -m "feat: Add mDNS local peer auto-discovery"
   ```
5. **Push to Your Branch:**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request** describing your implementation and testing methodology.

---

## 22. License

> **Notice:** This repository currently does not contain a standalone `LICENSE` file. All rights are reserved by the original project authors. An open-source license (such as MIT or Apache 2.0) may be adopted in future public releases.

---

## 23. Acknowledgements and References

- [PostgreSQL Documentation](https://www.postgresql.org/docs/) — ACID transactions, check constraints, and B-Tree indexing.
- [Express.js Guide](https://expressjs.com/) — Fast, unopinionated minimalist web framework for Node.js.
- [Expo Documentation](https://docs.expo.dev/) — Universal React applications and native hardware bindings.
- [Electron Documentation](https://www.electronjs.org/docs/latest/) — Desktop GUI window management and Node integration.
- [Prisma ORM](https://www.prisma.io/docs) — Next-generation ORM for Node.js and TypeScript.

---

## 24. Contact and Support

- **Repository Issues:** For bugs, feature requests, or installation issues, please open an issue on the project's GitHub repository.
- **Academic Context:** Developed as a Semester 3 collaborative capstone bridging Data Engineering (DE), Applied Software Development (ASD), and Interactive Systems Development (ISD).

---

## 25. Final Project Information

- **Project Name:** PocketBridge
- **Lead Contributors:** Mahin Patel (DE), Kunal Kumar Jha (ASD), Shekhar Jadhav (ISD)
- **Documentation Status:** Complete & Verified
- **Latest Build Target:** Android APK, Electron Desktop, Node.js CLI

*PocketBridge — Restoring speed, privacy, and simplicity to local device synchronization.*
