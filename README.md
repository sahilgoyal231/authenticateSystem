<![CDATA[<div align="center">

# 🔐 AuthentiKit

### A Full-Stack Authentication System Built with Next.js 16

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

**A production-ready, secure authentication starter kit featuring user registration, JWT-based login, email verification, route protection, and profile management — all wired together with Next.js App Router and MongoDB.**

[Getting Started](#-getting-started) •
[Architecture](#-architecture) •
[API Reference](#-api-reference) •
[Features](#-features) •
[Project Structure](#-project-structure)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧾 **User Registration** | Sign up with username, email, and password — with duplicate-user detection |
| 🔑 **Secure Login** | JWT-based authentication with HTTP-only cookie storage |
| 📧 **Email Verification** | Token-based email verification flow via Mailtrap SMTP |
| 🛡️ **Route Protection** | Middleware-driven access control for public and private routes |
| 👤 **Profile Management** | View authenticated user details and dynamic user profile pages |
| 🚪 **Logout** | Secure session termination by clearing HTTP-only cookies |
| 🔒 **Password Hashing** | Industry-standard bcrypt hashing with configurable salt rounds |
| ⏱️ **Token Expiry** | Verification and password-reset tokens auto-expire after 1 hour |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                           │
│                                                                     │
│  ┌──────────┐   ┌──────────┐   ┌─────────────┐   ┌──────────────┐  │
│  │  Signup   │   │  Login   │   │ Verify Email│   │   Profile    │  │
│  │  Page     │   │  Page    │   │    Page     │   │    Page      │  │
│  └─────┬────┘   └─────┬────┘   └──────┬──────┘   └──────┬───────┘  │
│        │              │               │                  │          │
└────────┼──────────────┼───────────────┼──────────────────┼──────────┘
         │              │               │                  │
         ▼              ▼               ▼                  ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     MIDDLEWARE (Route Guard)                         │
│                                                                     │
│   • Public routes:  /login, /signup, /verifyEmail                   │
│   • Protected:      /, /profile/*                                   │
│   • Redirects authenticated users away from public pages            │
│   • Redirects unauthenticated users to /login                       │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     API ROUTES (Next.js App Router)                  │
│                                                                     │
│   POST  /api/users/signup       → Register new user + send email    │
│   POST  /api/users/login        → Authenticate + issue JWT cookie   │
│   GET   /api/users/logout       → Clear JWT cookie                  │
│   GET   /api/users/myData       → Return current user (from token)  │
│   POST  /api/users/verifyEmail  → Verify email token                │
└────────────────────────────┬─────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────────┐
│                     DATA LAYER                                      │
│                                                                     │
│   ┌───────────────┐    ┌────────────────┐    ┌──────────────────┐   │
│   │   Mongoose     │    │   bcryptjs     │    │   jsonwebtoken   │   │
│   │   (MongoDB)    │    │   (Hashing)    │    │   (JWT Auth)     │   │
│   └───────┬───────┘    └────────────────┘    └──────────────────┘   │
│           │                                                         │
│           ▼                                                         │
│   ┌───────────────┐    ┌────────────────────────────────────────┐   │
│   │ MongoDB Atlas  │    │  Mailtrap (Email Sandbox / SMTP)      │   │
│   │   Cluster      │    │  → Verification & Password Reset      │   │
│   └───────────────┘    └────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Authentication Flow

```
    ┌────────┐          ┌────────┐          ┌────────┐         ┌──────────┐
    │  User  │          │ Server │          │ MongoDB│         │ Mailtrap │
    └───┬────┘          └───┬────┘          └───┬────┘         └────┬─────┘
        │                   │                   │                   │
        │  1. POST /signup  │                   │                   │
        │──────────────────>│                   │                   │
        │                   │  2. Check if      │                   │
        │                   │     user exists    │                   │
        │                   │──────────────────>│                   │
        │                   │  3. Hash password  │                   │
        │                   │  4. Save user      │                   │
        │                   │──────────────────>│                   │
        │                   │  5. Send verify    │                   │
        │                   │     email          │                   │
        │                   │──────────────────────────────────────>│
        │  6. Success       │                   │                   │
        │<──────────────────│                   │                   │
        │                   │                   │                   │
        │  7. Click email   │                   │                   │
        │     verify link   │                   │                   │
        │──────────────────>│                   │                   │
        │                   │  8. Validate token │                   │
        │                   │──────────────────>│                   │
        │                   │  9. Set isVerified │                   │
        │                   │──────────────────>│                   │
        │  10. Verified! ✅  │                   │                   │
        │<──────────────────│                   │                   │
        │                   │                   │                   │
        │  11. POST /login  │                   │                   │
        │──────────────────>│                   │                   │
        │                   │  12. Validate      │                   │
        │                   │      credentials   │                   │
        │                   │──────────────────>│                   │
        │                   │  13. Sign JWT      │                   │
        │  14. Set cookie 🍪│                   │                   │
        │<──────────────────│                   │                   │
        │                   │                   │                   │
    ┌───┴────┐          ┌───┴────┐          ┌───┴────┐         ┌────┴─────┐
    │  User  │          │ Server │          │ MongoDB│         │ Mailtrap │
    └────────┘          └────────┘          └────────┘         └──────────┘
```

---

## 📁 Project Structure

```
nextjs-project1/
│
├── 📄 package.json                 # Dependencies & scripts
├── 📄 next.config.ts               # Next.js configuration
├── 📄 tsconfig.json                # TypeScript configuration
├── 📄 postcss.config.mjs           # PostCSS (Tailwind) config
├── 📄 eslint.config.mjs            # ESLint configuration
├── 📄 .env                         # Environment variables (⚠️ do not commit)
├── 📄 .gitignore                   # Git ignore rules
│
├── 📂 public/                      # Static assets (SVGs, favicon)
│
└── 📂 src/
    │
    ├── 📂 app/                     # Next.js App Router
    │   ├── 📄 layout.tsx           # Root layout (Geist fonts, global CSS)
    │   ├── 📄 page.tsx             # Home / landing page
    │   ├── 📄 globals.css          # Global Tailwind styles
    │   │
    │   ├── 📂 signup/
    │   │   └── 📄 page.tsx         # User registration form
    │   │
    │   ├── 📂 login/
    │   │   └── 📄 page.tsx         # User login form
    │   │
    │   ├── 📂 profile/
    │   │   ├── 📄 page.tsx         # Profile dashboard (logout, fetch user)
    │   │   └── 📂 [id]/
    │   │       └── 📄 page.tsx     # Dynamic user profile page
    │   │
    │   ├── 📂 verifyEmail/
    │   │   └── 📄 page.tsx         # Email verification handler
    │   │
    │   └── 📂 api/users/           # RESTful API routes
    │       ├── 📂 signup/
    │       │   └── 📄 route.ts     # POST — register user
    │       ├── 📂 login/
    │       │   └── 📄 route.ts     # POST — authenticate user
    │       ├── 📂 logout/
    │       │   └── 📄 route.ts     # GET  — clear session
    │       ├── 📂 myData/
    │       │   └── 📄 route.ts     # GET  — get current user
    │       └── 📂 verifyEmail/
    │           └── 📄 route.ts     # POST — verify email token
    │
    ├── 📂 dbConfig/
    │   └── 📄 dbConfig.ts          # MongoDB connection singleton
    │
    ├── 📂 helpers/
    │   ├── 📄 mailer.ts            # Nodemailer email utility (Mailtrap)
    │   └── 📄 getDataFromToken.ts  # JWT token decoder helper
    │
    ├── 📂 models/
    │   └── 📄 userModel.js         # Mongoose User schema & model
    │
    └── 📄 proxy.ts                 # Middleware — route guard logic
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

| Tool | Version | Purpose |
|------|---------|---------|
| [Node.js](https://nodejs.org/) | ≥ 18.x | JavaScript runtime |
| [npm](https://www.npmjs.com/) | ≥ 9.x | Package manager |
| [MongoDB Atlas](https://www.mongodb.com/atlas) | — | Cloud database |
| [Mailtrap](https://mailtrap.io/) | — | Email testing sandbox |

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nextjs-project1.git
cd nextjs-project1
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# ─── Database ──────────────────────────────────────────
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>"

# ─── Auth ──────────────────────────────────────────────
TOKEN_SECRET="your-super-secret-jwt-signing-key"

# ─── App ───────────────────────────────────────────────
DOMAIN=http://localhost:3000

# ─── Email (Mailtrap) ─────────────────────────────────
MAILTRAP_USER="your-mailtrap-user"
MAILTRAP_PASS="your-mailtrap-pass"
```

> [!IMPORTANT]
> Never commit your `.env` file to version control. The `.gitignore` already excludes it.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — the middleware will redirect you to `/login` if you're not authenticated.

### 5. Build for production

```bash
npm run build
npm start
```

---

## 📡 API Reference

### `POST /api/users/signup`

Register a new user account.

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response** `200`:
```json
{
  "message": "User created successfully",
  "success": true,
  "savedUser": { ... }
}
```

**Error Response** `400`:
```json
{
  "error": "User already exists"
}
```

---

### `POST /api/users/login`

Authenticate a user and receive an HTTP-only JWT cookie.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Success Response** `200`:
```json
{
  "message": "Login successful",
  "success": true
}
```
> Sets an `httpOnly` cookie named `token` with a **1-day expiry**.

**Error Responses:**
| Status | Message |
|--------|---------|
| `400` | `User does not exists` |
| `400` | `Invalid password` |

---

### `GET /api/users/logout`

Terminate the user session by clearing the JWT cookie.

**Success Response** `200`:
```json
{
  "message": "Logout successful",
  "success": true
}
```

---

### `GET /api/users/myData`

Retrieve the authenticated user's profile (requires valid JWT cookie).

**Success Response** `200`:
```json
{
  "message": "User found",
  "data": {
    "_id": "...",
    "username": "johndoe",
    "email": "john@example.com",
    "isVerified": true,
    "isAdmin": false
  }
}
```
> ⚠️ The `password` field is automatically excluded from the response.

---

### `POST /api/users/verifyEmail`

Verify a user's email address using the token sent via email.

**Request Body:**
```json
{
  "token": "hashed-verification-token"
}
```

**Success Response** `200`:
```json
{
  "message": "Email verified successfully",
  "success": true
}
```

**Error Response** `400`:
```json
{
  "error": "Invalid token"
}
```

---

## 🗃️ Database Schema

### User Model

```javascript
{
  username:                 String   // required, unique
  email:                    String   // required, unique
  password:                 String   // required (bcrypt hashed)
  isVerified:               Boolean  // default: false
  isAdmin:                  Boolean  // default: false
  forgotPasswordToken:      String   // optional — for password reset
  forgotPasswordTokenExpiry: Date    // auto-expires after 1 hour
  verifyToken:              String   // optional — for email verification
  verifyTokenExpiry:        Date     // auto-expires after 1 hour
}
```

---

## 🛡️ Security Features

| Layer | Implementation |
|-------|---------------|
| **Password Storage** | Hashed with `bcryptjs` (10 salt rounds) — raw passwords are never stored |
| **Session Management** | JWT stored in `httpOnly` cookies — immune to XSS-based token theft |
| **Token Expiry** | Login tokens expire in 24 hours; verification tokens expire in 1 hour |
| **Route Protection** | Middleware intercepts every request — unauthenticated users cannot access protected pages |
| **Duplicate Prevention** | Email uniqueness enforced at both the schema and API level |
| **Hot-Reload Safety** | Mongoose model is checked for existence before creation to avoid OverwriteModelError |

---

## 🛠️ Tech Stack

| Category | Technology | Why |
|----------|-----------|-----|
| **Framework** | Next.js 16 (App Router) | Full-stack React with server components, API routes, and middleware |
| **Language** | TypeScript 5 | Type safety across the entire codebase |
| **UI** | React 19 + Tailwind CSS 4 | Modern component model with utility-first styling |
| **Database** | MongoDB Atlas + Mongoose 9 | Flexible document store with elegant ODM |
| **Auth** | jsonwebtoken + bcryptjs | Industry-standard JWT auth and password hashing |
| **Email** | Nodemailer + Mailtrap | Transactional emails with safe sandbox testing |
| **HTTP Client** | Axios | Promise-based HTTP for client-side API calls |
| **Notifications** | react-hot-toast | Beautiful toast notifications for user feedback |
| **Fonts** | Geist Sans & Geist Mono | Vercel's premium typeface family |

---

## 🧭 Route Map

```
                        ┌──────────────────┐
                        │   / (Home Page)  │
                        │   🔒 Protected   │
                        └────────┬─────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
    ┌─────────────────┐ ┌──────────────┐  ┌─────────────────┐
    │  /login          │ │  /signup      │  │  /profile       │
    │  🌐 Public       │ │  🌐 Public    │  │  🔒 Protected   │
    └────────┬────────┘ └──────┬───────┘  └────────┬────────┘
             │                 │                   │
             │                 │                   ▼
             │                 │          ┌─────────────────┐
             │                 │          │  /profile/[id]  │
             │                 │          │  🔒 Protected   │
             │                 │          └─────────────────┘
             │                 │
             ▼                 ▼
    ┌──────────────────────────────────┐
    │      /verifyEmail?token=xxx      │
    │      🌐 Public                   │
    └──────────────────────────────────┘
```

---

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Create optimized production build |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint to check code quality |

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using Next.js, MongoDB & TypeScript**

*If this project helped you, consider giving it a ⭐*

</div>
]]>
