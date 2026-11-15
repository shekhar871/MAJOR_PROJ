# Subject Contribution Report: Interactive Systems Development (ISD)
**Lead Contributor:** Shekhar Jadhav  
**Collaborators:** Kunal Kumar Jha, Mahin Patel

### Primary Responsibilities (Shekhar):
- Built React Native / Expo mobile app screens: Auth (login/register with form validation), Home dashboard, QR pairing view with manual code fallback, and Notes/Tasks manager.
- Implemented file upload flow from phone using document picker and upload progress handling.
- Built Electron desktop companion app with file inbox table, quick download links, and one-time pairing QR code display.
- Created lightweight Node.js terminal CLI (`pocketbridge`) with commands for `status`, `tasks list`, `files list`, and `notes add`.
- Handled UI edge cases: empty states, loading indicators, token expiration re-login, and local LAN IP configuration.

### Cross-Subject Contributions:
- **In DE (Database):** Created realistic demo seed data (`db/seeds/seed.sql`) containing sample users, notes, tasks, and devices.
- **In ASD (Backend):** Wrote API test scripts in `server/tests/api.test.js` to verify routing and error responses before frontend integration.
