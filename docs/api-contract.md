# PocketBridge API Contract

Base URL: `http://<laptop-ip>:4000/api`
Content-Type: `application/json` (except multipart file upload/download)
Authentication: `Authorization: Bearer <JWT>`

---

## 1. Authentication & Pairing

### POST `/auth/register` (Public)
Creates user account and registers initial device.
- **Request:**
  ```json
  {
    "email": "demo@pocketbridge.local",
    "password": "Password123!",
    "fullName": "Student Developer",
    "deviceName": "Main Laptop",
    "platform": "desktop"
  }
  ```
- **Response (201 Created):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "user": { "id": "uuid", "name": "Student Developer", "email": "demo@pocketbridge.local" },
    "device": { "id": "uuid", "name": "Main Laptop", "platform": "desktop" }
  }
  ```

### POST `/auth/login` (Public)
- **Request:**
  ```json
  { "email": "demo@pocketbridge.local", "password": "Password123!", "deviceName": "Main Laptop" }
  ```
- **Response (200 OK):** Same shape as register.

### POST `/pairings` (Protected)
Generates 16-byte cryptographically secure pairing token with 5-minute expiry.
- **Response (201 Created):**
  ```json
  {
    "code": "a3f5b7c9e120...",
    "expiresAt": "2026-11-13T10:05:00.000Z",
    "qrPayload": "{\"code\":\"...\",\"serverUrl\":\"...\"}"
  }
  ```

### POST `/pairings/consume` (Public / Pre-auth)
Consumes pairing code atomically with row-level locks (`SELECT FOR UPDATE`).
- **Request:**
  ```json
  {
    "code": "a3f5b7c9e120...",
    "deviceName": "Shekhar Phone",
    "platform": "android"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "token": "eyJhbGciOi...",
    "device": { "device_id": "uuid", "device_name": "Shekhar Phone", "platform": "android" },
    "message": "Device successfully paired"
  }
  ```

---

## 2. Files API

### POST `/files` (Protected, `multipart/form-data`)
- **Body:** `file` (binary stream)
- **Response (201 Created):**
  ```json
  {
    "file_id": "uuid",
    "original_name": "lecture.pdf",
    "size_bytes": 1048576,
    "mime_type": "application/pdf",
    "created_at": "...",
    "status": "stored"
  }
  ```

### GET `/files` (Protected)
Returns all files uploaded by devices belonging to the authenticated user.

### GET `/files/:id/download` (Protected)
Streams the file bytes with Content-Disposition attachment header. Verifies user ownership.

---

## 3. Notes & Tasks CRUD

### GET / POST `/notes` (Protected)
### DELETE `/notes/:id` (Protected)

### GET / POST `/tasks` (Protected)
### PATCH `/tasks/:id` (Protected)
Updates task `status` (`todo`, `in_progress`, `done`) or `priority`.
