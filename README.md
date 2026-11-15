# PocketBridge

PocketBridge is a local-first system designed to transfer files, notes, and tasks directly between a smartphone and a laptop connected to the same Wi-Fi network, without needing cloud services like Google Drive or messaging apps.

## Team Members and Roles

We worked collaboratively across all three areas (DE, ASD, and ISD) so everyone has hands-on understanding of the entire system:

- **Mahin Patel**: Lead on Database Engineering (schema design, 3NF normalization, SQL reporting) + contributed to backend DB pool setup and desktop testing.
- **Kunal Kumar Jha**: Lead on Backend & APIs (Express API architecture, JWT authentication, file upload/stream) + contributed to SQL queries and mobile API integration.
- **Shekhar Jadhav**: Lead on Client Applications (React Native mobile app, Electron desktop companion, CLI) + contributed to API testing and database seed generation.

## Project Structure

```
pocketbridge/
├── apps/
│   ├── mobile/       # React Native / Expo mobile application
│   ├── desktop/      # Electron desktop companion application
│   └── cli/          # Node.js command-line interface
├── server/           # Express REST API with Prisma ORM
│   ├── src/          # Controllers, routes, and middleware
│   └── storage/      # Local uploaded files (gitignored)
└── db/               # PostgreSQL schema, seeds, queries, and reports
```

## How to Run

### 1. Database Setup
Make sure PostgreSQL is running locally on port 5432:
```bash
createdb pocketbridge
psql -d pocketbridge -f db/schema.sql
psql -d pocketbridge -f db/seeds/seed.sql
```

### 2. Backend Server
```bash
cd server
npm install
cp ../.env.example .env
npm start
```
The server will run on `http://0.0.0.0:4000`.

### 3. Mobile Client
```bash
cd apps/mobile
npm install
npm start
```

### 4. Desktop Client
```bash
cd apps/desktop
npm install
npm start
```

### 5. CLI Tool
```bash
cd apps/cli
node pocketbridge.js status
node pocketbridge.js tasks list
```

## Documentation
- [Data Dictionary](db/docs/data-dictionary.md)
- [3NF Normalization Report](db/docs/normalization-3nf.md)
- [ACID and Concurrency Test](db/docs/acid-concurrency.md)
- [API Contract](docs/api-contract.md)
- [Individual Contribution Summaries](docs/contributions/)
