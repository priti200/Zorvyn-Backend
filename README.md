# Finance Dashboard Backend

A REST API backend for a finance dashboard system with role-based access control.

**Live API**: https://zorvyn-backend-lw8d.onrender.com/  
**API Documentation**: https://zorvyn-backend-lw8d.onrender.com/api-docs

## Features

- **User & Role Management** - Users with roles (Viewer/Analyst/Admin)
- **Financial Records CRUD** - Full CRUD with category and notes
- **Dashboard APIs** - Summary, category-wise totals, trends
- **Role-Based Access Control** - Middleware-based enforcement
- **Input Validation** - Request validation with error responses
- **JWT Authentication** - Token-based auth
- **Interactive API Docs** - Swagger UI for testing endpoints

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Auth**: JWT + bcrypt
- **API Docs**: Swagger UI

## Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/finance_dashboard
JWT_SECRET=your_secure_secret_here
```

### Run

```bash
npm start        # Production
npm run dev      # Development with nodemon
```

### Test

```bash
npm test
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/auth/login` | Login user | Public |

### Records

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/records` | List records (paginated) | All |
| GET | `/records/:id` | Get single record | All |
| POST | `/records` | Create record | Admin, Analyst |
| PUT | `/records/:id` | Update record | Admin |
| DELETE | `/records/:id` | Delete record | Admin |

### Dashboard

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/dashboard/summary` | Get summary (totals, category-wise) | All |
| GET | `/dashboard/trends` | Get monthly trends | All |

## Quick Start with cURL

### Register
```bash
curl -X POST https://zorvyn-backend-lw8d.onrender.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@test.com","password":"123456","role":"Admin"}'
```

### Login
```bash
curl -X POST https://zorvyn-backend-lw8d.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}'
```

### Create Record (with token)
```bash
curl -X POST https://zorvyn-backend-lw8d.onrender.com/records \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Salary","amount":5000,"type":"income","category":"salary","notes":"Monthly salary"}'
```

### Get Dashboard Summary
```bash
curl https://zorvyn-backend-lw8d.onrender.com/dashboard/summary \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Filter Records
```bash
curl "https://zorvyn-backend-lw8d.onrender.com/records?type=expense&category=food" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Role Permissions

| Role | Create | Read | Update | Delete | Dashboard |
|------|--------|------|--------|--------|-----------|
| Viewer | ❌ | ✅ | ❌ | ❌ | ✅ |
| Analyst | ✅ | ✅ | ❌ | ❌ | ✅ |
| Admin | ✅ | ✅ | ✅ | ✅ | ✅ |

## Data Models

### User
- `username` (string, required, unique)
- `email` (string, required, unique)
- `password` (string, hashed)
- `role` (enum: Viewer, Analyst, Admin)
- `status` (enum: active, inactive)
- `timestamps` (createdAt, updatedAt)

### FinancialRecord
- `title` (string, required)
- `amount` (number, required)
- `type` (enum: income, expense)
- `category` (string, default: "other")
- `notes` (string, default: "")
- `date` (Date, default: now)
- `userId` (ObjectId, ref: User)
- `timestamps` (createdAt, updatedAt)

## Assumptions

1. **Per-user scope**: All dashboard data is scoped to the authenticated user
2. **Hybrid categories**: Users can enter any category (not restricted to enum)
3. **ISO dates**: Dates passed as ISO 8601 format (YYYY-MM-DD)
4. **Soft delete**: Delete operations are hard deletes (not soft delete)

## Testing

Tests use `mongodb-memory-server` for in-memory MongoDB:
- Tests covering auth, records, validation, pagination
- Run with `npm test`

## License

MIT
