# 🔐 AuthentiKit

> A full-stack authentication system built with **Next.js 16**, **MongoDB**, and **TypeScript** — featuring JWT-based login, email verification, route protection, and profile management.

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [How Authentication Works](#how-authentication-works)
6. [API Reference](#api-reference)
7. [Database Schema](#database-schema)
8. [Route Protection](#route-protection)
9. [Security](#security)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- **User Registration** — Sign up with username, email, and password (with duplicate detection)
- **Secure Login** — JWT authentication stored in HTTP-only cookies
- **Email Verification** — Token-based flow via Mailtrap SMTP with 1-hour expiry
- **Route Protection** — Middleware guards that redirect based on auth state
- **Profile Management** — View user details and dynamic profile pages
- **Secure Logout** — Session termination by clearing HTTP-only cookies
- **Password Hashing** — bcrypt with 10 salt rounds (raw passwords never stored)

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js 16 (App Router) | Full-stack React with API routes & middleware |
| Language | TypeScript 5 | End-to-end type safety |
| Styling | Tailwind CSS 4 | Utility-first CSS |
| Database | MongoDB Atlas + Mongoose 9 | Document store with ODM |
| Auth | jsonwebtoken + bcryptjs | JWT tokens & password hashing |
| Email | Nodemailer + Mailtrap | Transactional email with sandbox testing |
| HTTP | Axios | Client-side API calls |
| UX | react-hot-toast | Toast notifications |
| Fonts | Geist Sans & Geist Mono | Vercel's typeface family |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18.x
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)
- [Mailtrap](https://mailtrap.io/) account (free tier works)

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/nextjs-project1.git
cd nextjs-project1

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the project root with:

```env
MONGO_URI="mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/<dbname>"
TOKEN_SECRET="your-jwt-signing-secret"
DOMAIN=http://localhost:3000
MAILTRAP_USER="your-mailtrap-user"
MAILTRAP_PASS="your-mailtrap-pass"
```

> **⚠️ Do not commit `.env` to version control.** It's already in `.gitignore`.

### Run

```bash
npm run dev       # Development server at http://localhost:3000
npm run build     # Production build
npm start         # Serve production build
npm run lint      # Lint the codebase
```

---

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, global CSS)
│   ├── page.tsx                  # Home page
│   ├── globals.css               # Global styles
│   │
│   ├── signup/page.tsx           # Registration form
│   ├── login/page.tsx            # Login form
│   ├── verifyEmail/page.tsx      # Email verification handler
│   │
│   ├── profile/
│   │   ├── page.tsx              # Profile dashboard
│   │   └── [id]/page.tsx         # Dynamic user profile
│   │
│   └── api/users/                # REST API routes
│       ├── signup/route.ts       # POST — register user
│       ├── login/route.ts        # POST — authenticate & issue JWT
│       ├── logout/route.ts       # GET  — clear session cookie
│       ├── myData/route.ts       # GET  — fetch current user
│       └── verifyEmail/route.ts  # POST — verify email token
│
├── dbConfig/
│   └── dbConfig.ts               # MongoDB connection (singleton)
│
├── helpers/
│   ├── mailer.ts                 # Email sender (Nodemailer + Mailtrap)
│   └── getDataFromToken.ts       # JWT decoder utility
│
├── models/
│   └── userModel.js              # Mongoose User schema
│
└── proxy.ts                      # Middleware — route guard logic
```

---

## How Authentication Works

The system follows a standard JWT-based flow:

### 1. Sign Up
User submits username, email, and password → server hashes the password with bcrypt → saves the user to MongoDB → sends a verification email with a hashed token link.

### 2. Verify Email
User clicks the link in their email → the token is matched against the database → if valid and not expired (1h window), `isVerified` is set to `true`.

### 3. Log In
User submits email and password → server fetches the user, compares the bcrypt hash → if valid, signs a JWT containing `{ id, username, email }` → stores it in an `httpOnly` cookie with 24h expiry.

### 4. Access Protected Pages
Every request passes through the middleware (`proxy.ts`). If the user has no valid token cookie and tries to access a protected route, they're redirected to `/login`. If they're already logged in and visit `/login` or `/signup`, they're sent to `/`.

### 5. Log Out
The server responds with an expired cookie, clearing the JWT from the browser.

---

## API Reference

### Register User

```
POST /api/users/signup
```

| Field | Type | Required |
|-------|------|----------|
| `username` | string | ✅ |
| `email` | string | ✅ |
| `password` | string | ✅ |

**200** — `{ message: "User created successfully", success: true, savedUser: {...} }`
**400** — `{ error: "User already exists" }`

---

### Login

```
POST /api/users/login
```

| Field | Type | Required |
|-------|------|----------|
| `email` | string | ✅ |
| `password` | string | ✅ |

**200** — `{ message: "Login successful", success: true }` + sets `token` cookie
**400** — `{ error: "User does not exists" }` or `{ error: "Invalid password" }`

---

### Logout

```
GET /api/users/logout
```

**200** — `{ message: "Logout successful", success: true }` + clears `token` cookie

---

### Get Current User

```
GET /api/users/myData
```

Requires valid JWT cookie. Returns user data **without the password field**.

**200** — `{ message: "User found", data: { _id, username, email, isVerified, isAdmin } }`

---

### Verify Email

```
POST /api/users/verifyEmail
```

| Field | Type | Required |
|-------|------|----------|
| `token` | string | ✅ |

**200** — `{ message: "Email verified successfully", success: true }`
**400** — `{ error: "Invalid token" }`

---

## Database Schema

**User** (`users` collection):

| Field | Type | Default | Notes |
|-------|------|---------|-------|
| `username` | String | — | Required, unique |
| `email` | String | — | Required, unique |
| `password` | String | — | Required, bcrypt hashed |
| `isVerified` | Boolean | `false` | Set to `true` after email verification |
| `isAdmin` | Boolean | `false` | Admin flag |
| `forgotPasswordToken` | String | — | For password reset flow |
| `forgotPasswordTokenExpiry` | Date | — | Expires after 1 hour |
| `verifyToken` | String | — | For email verification flow |
| `verifyTokenExpiry` | Date | — | Expires after 1 hour |

---

## Route Protection

The middleware in `proxy.ts` categorizes routes and controls access:

| Route | Access | Behavior |
|-------|--------|----------|
| `/login` | 🌐 Public | Redirects to `/` if already logged in |
| `/signup` | 🌐 Public | Redirects to `/` if already logged in |
| `/verifyEmail` | 🌐 Public | Redirects to `/` if already logged in |
| `/` | 🔒 Protected | Redirects to `/login` if not authenticated |
| `/profile/*` | 🔒 Protected | Redirects to `/login` if not authenticated |

---

## Security

| Concern | How it's handled |
|---------|-----------------|
| Password storage | Hashed with bcrypt (10 salt rounds) — plaintext never stored |
| Token theft (XSS) | JWT is in an `httpOnly` cookie — inaccessible to JavaScript |
| Session expiry | Login JWT expires in 24 hours |
| Verification expiry | Email/reset tokens expire in 1 hour |
| Duplicate accounts | Uniqueness enforced at schema + API level |
| Hot-reload safety | Mongoose model existence check prevents `OverwriteModelError` |

---

## Contributing

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m 'Add your feature'`
4. Push — `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is open source under the [MIT License](LICENSE).

---

<p align="center">Built with ❤️ using Next.js, MongoDB & TypeScript</p>
