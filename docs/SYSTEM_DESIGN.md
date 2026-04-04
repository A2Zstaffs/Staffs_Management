# System Design — A2Z Staffs VMS

> Vendor Management System for connecting clients, recruiters, candidates, consultancies, and KAMs on a single platform.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Request Flow](#request-flow)
4. [Traffic & Request Handling](#traffic--request-handling)
5. [Authentication System](#authentication-system)
6. [Database Design](#database-design)
7. [File Storage](#file-storage)
8. [Email & Notifications](#email--notifications)
9. [Role System](#role-system)
10. [API Structure](#api-structure)
11. [Security Layers](#security-layers)
12. [Deployment Architecture](#deployment-architecture)
13. [Known Limitations](#known-limitations)
14. [Future Scaling Roadmap](#future-scaling-roadmap)

---

## Architecture Overview

```
                        Internet
                            │
              ┌─────────────┴──────────────┐
              │                            │
     ┌────────┴─────────┐       ┌──────────┴────────┐
     │     Vercel        │       │   AWS EC2 t3.micro │
     │  (Frontend CDN)   │       │   Nginx :443/:80   │
     │  Next.js 16.1.6   │       └──────────┬─────────┘
     │  Global Edge      │                  │
     │  Auto-deploy      │       ┌──────────┴─────────┐
     └───────────────────┘       │  Express.js Backend │
              │                  │  Port 5001          │
              │ HTTPS API calls  │  (PM2 managed)      │
              └──────────────────┴──────────┬──────────┘
                                            │
                               ┌────────────┴───────────┐
                               │     MongoDB Atlas       │
                               │  (Cloud hosted, pooled) │
                               └────────────────────────┘
                                            │
                               ┌────────────┴───────────┐
                               │       AWS S3            │
                               │  (Resume / file storage)│
                               └────────────────────────┘
```

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Hosting | Vercel | Global CDN, auto-deploy from git, free SSL |
| Frontend App | Next.js 16.1.6 (Turbopack) | SSR + CSR React application |
| Backend Hosting | AWS EC2 t3.micro | Express API server |
| Reverse Proxy | Nginx | Rate limiting, SSL termination on EC2 |
| Database | MongoDB Atlas + Mongoose | Data persistence |
| Auth | JWT + Google OAuth 2.0 | Session management |
| File Storage | AWS S3 + Multer | Resume and document uploads |
| Email | Nodemailer + Gmail SMTP | OTP, notifications |
| Process Manager | PM2 | Auto-restart, memory management on EC2 |
| Domain | a2zstaffs.com | Production domain |

---

## Request Flow

### Frontend Page Request

```
User Browser
    │
    ▼
Vercel Edge Network (global CDN — 100+ locations worldwide)
    │  static assets → served from nearest edge, never hits origin
    │  SSR pages → rendered at edge or origin Vercel server
    │
    ▼  (only for data fetching)
Express API on EC2 (:5001 via Nginx :443)
    │
    ▼
MongoDB Atlas
    │
    ▼
Response bubbles back up the chain
```

### API Request Flow

```
User Browser
    │
    ▼
Nginx (:443)
    │  checks rate limit zone (auth=5r/m, api=60r/m)
    │  if exceeded → returns HTTP 429 instantly (Node never sees it)
    │  if allowed → proxy_pass to localhost:5001
    ▼
Express (:5001)
    │  helmet() → security headers
    │  cors() → origin validation
    │  express-rate-limit → secondary app-level limit (3000 req/15min)
    │  JWT middleware → token validation
    │  route handler → async/await controller
    ▼
MongoDB Atlas (connection pool, max 10 connections)
    │
    ▼
JSON response
```

---

## Traffic & Request Handling

### How 10,000 Simultaneous Requests Are Handled

```
10,000 requests hit Nginx
         │
    [Nginx — kernel level, epoll]
    Memory cost: ~20MB for 10k connections
         │
    ┌────┴─────────────────────────────────┐
    │  Rate limit check per IP             │
    │                                      │
    │  /api/auth/* → 5r/min + burst 3      │
    │  /api/*      → 60r/min + burst 20    │
    │  /*          → 30r/sec + burst 50    │
    │                                      │
    │  Excess requests → HTTP 429 (<1ms)   │
    │  Node.js never sees them             │
    └────┬─────────────────────────────────┘
         │ Only allowed requests forwarded
         ▼
    [Node.js — single threaded, async event loop]
    Memory cost: ~80-100KB per active request
         │
    async/await — non-blocking I/O
    Node handles hundreds concurrently
    while waiting for DB responses
         │
         ▼
    [MongoDB Atlas — connection pool]
    Max 10 simultaneous DB connections
    Queues additional requests internally
```

### Rate Limits (Current Config)

| Endpoint | Per-IP Limit | Burst | Effective Max |
|----------|-------------|-------|---------------|
| `/api/auth/login` | 5 req/min | 3 | 8 req/min |
| `/api/auth/signup` | 5 req/min | 3 | 8 req/min |
| `/api/auth/google` | 5 req/min | 3 | 8 req/min |
| `/api/*` (other) | 60 req/min | 20 | 80 req/min |
| `/` (frontend) | 30 req/sec | 50 | 80 req/sec |
| Global (app level) | 3000 req/15min | — | per IP |

### Concurrency Model

- **Nginx**: Event-driven, non-blocking. Handles 10,000+ connections with ~20MB RAM using Linux `epoll`
- **Node.js**: Single-threaded async event loop. Never blocks on I/O — while waiting for MongoDB, it handles the next request
- **MongoDB**: Connection pooled (min 2, max 10). Additional requests queue internally

### Estimated Capacity (t3.micro, current setup)

| Metric | Estimate |
|--------|----------|
| Concurrent users (comfortable) | 50–100 |
| Concurrent users (max before degradation) | 200–300 |
| API requests/sec sustained | 200–500 |
| Auth requests/min per IP | 8 (rate limited) |
| File upload size limit | 10MB |
| PM2 memory limit per process | 400MB |

---

## Authentication System

### JWT Flow

```
Login Request
    │
    ▼
Validate email + bcrypt password check
    │
    ▼
Generate JWT (signed with JWT_SECRET)
    │  Payload: { id, role, email }
    │  Expiry: 7 days (rememberMe) or session
    │
    ▼
Token stored in:
    ├── sessionStorage (default — clears on tab close)
    └── localStorage (if rememberMe checked)

Every API request:
    Authorization: Bearer <token>
    │
    ▼
JWT middleware validates signature + expiry
    │
    ▼
req.user populated → route handler executes
```

### Google OAuth Flow

```
User clicks "Sign in with Google"
    │
    ▼
Google returns credential token (JWT)
    │
    ▼
Frontend sends credential to /api/auth/google
    │
    ▼
Backend verifies token with Google API
    │  Extracts: email, name, googleId, picture
    │
    ▼
Check if user exists in MongoDB
    ├── Yes → return existing user + our JWT
    └── No  → create new user with role → return JWT
```

### Email OTP Verification

```
Signup request
    │
    ▼
User created with isEmailVerified: false
    │
    ▼
6-digit OTP generated → stored in memory (Map) with 10min expiry
    │
    ▼
Email sent via Nodemailer/Gmail SMTP
    │
    ▼
User submits OTP → verified → isEmailVerified: true → JWT issued
```

> ⚠️ **Known limitation**: OTP stored in-memory (Map). Lost on server restart. Migration to Redis/MongoDB TTL planned.

---

## Database Design

### Collections

```
users
├── _id, fullName, email, password (bcrypt)
├── role: [client|recruiter|candidate|consultancy|kam|recruiter_manager]
├── googleId, picture (OAuth users)
├── isEmailVerified, isApproved
└── createdAt, updatedAt

jobs
├── _id, title, description, skills[]
├── status: [pending|approved|active|closed]
├── postedBy (ref: users), client (ref: users)
├── applications[]
└── salary, location, jobType

applications
├── _id, job (ref: jobs), candidate (ref: users)
├── recruiter (ref: users)
├── status: [applied|shortlisted|interview|selected|rejected]
├── resumeUrl (S3 link)
└── timeline[]

profiles
├── _id, user (ref: users)
├── skills[], experience[], education[]
└── resumeUrl, linkedIn, github

notifications
├── _id, recipient (ref: users)
├── type, message, isRead
└── createdAt

commissions
├── _id, recruiter (ref: users)
├── application (ref: applications)
└── amount, status, paidAt

recruiterAssignments / clientAssignments
└── KAM assignment tracking
```

### MongoDB Connection Config

```javascript
maxPoolSize: 10      // max simultaneous connections
minPoolSize: 2       // always-warm connections
serverSelectionTimeoutMS: 30000
socketTimeoutMS: 45000
retryWrites: true
retryReads: true
```

---

## File Storage

```
User uploads resume/document
    │
    ▼
Multer (middleware) processes multipart/form-data
    │  size limit: 10MB
    │  file type validation
    │
    ▼
Multer-S3 streams directly to AWS S3
    │  Never written to disk on EC2
    │  Bucket: private, IAM-scoped access
    │
    ▼
S3 URL stored in MongoDB (profiles.resumeUrl)
    │
    ▼
Presigned URL generated per request for secure access
```

---

## Email & Notifications

### Email (Nodemailer)
- Provider: Gmail SMTP with App Password
- Used for: OTP verification, job application updates, recruiter notifications
- Async — `await transporter.sendMail()` — non-blocking

### In-App Notifications
- Stored in `notifications` MongoDB collection
- Polled by frontend on dashboard load
- Real-time: not implemented (WebSocket planned for future)

---

## Role System

| Role | Access |
|------|--------|
| `candidate` | Browse jobs, apply, manage profile |
| `recruiter` | Submit candidates, track applications |
| `recruiter_manager` | Manage recruiters, view team performance |
| `client` | Post jobs, review candidates |
| `consultancy` | Partner access, manage recruiters |
| `kam` | Key Account Manager — manage client relationships |

### Route Protection

```
Request hits protected route
    │
    ▼
JWT middleware (auth.js)
    │  validates token → populates req.user
    │
    ▼
Role middleware
    │  checks req.user.role against allowed roles
    │  mismatch → HTTP 403 Forbidden
    │
    ▼
Controller executes
```

---

## API Structure

```
/api/health                    → server health check
/api/auth/*                    → login, signup, google, OTP, logout
/api/jobs/*                    → CRUD for job postings
/api/dashboard/*               → role-specific dashboard data
/api/profiles/*                → candidate profiles
/api/notifications/*           → in-app notifications
/api/client/*                  → client-specific routes
/api/kam/*                     → KAM-specific routes
/api/recruiter-manager/*       → recruiter manager routes
/api/admin/*                   → admin panel routes
```

---

## Security Layers

```
Layer 1 — Network (AWS)
├── EC2 Security Group: only ports 22, 80, 443 open
└── UFW firewall: blocks direct access to 3000, 5001

Layer 2 — Nginx
├── Rate limiting per IP per endpoint
├── HTTP → HTTPS redirect
├── Security headers (HSTS, X-Frame-Options)
└── client_max_body_size: 11MB cap

Layer 3 — Express
├── Helmet.js (15 security headers)
├── CORS whitelist (localhost:3000, a2zstaffs.com only)
├── express-rate-limit (3000 req/15min backup limit)
└── Body size limit: 10MB

Layer 4 — Application
├── bcrypt password hashing (salt rounds: 10+)
├── JWT signature verification on every request
├── Role-based access control per route
└── Email verification before account activation

Layer 5 — Database
├── MongoDB Atlas (cloud, not on same EC2)
├── Connection string in .env (never committed)
└── Mongoose schema validation
```

---

## Deployment Architecture

### Current (Split Deployment)

```
┌─────────────────────────────────┐    ┌──────────────────────────────────┐
│           Vercel                │    │         AWS EC2 t3.micro         │
│                                 │    │                                  │
│  Next.js frontend               │    │  Nginx (port 80/443)             │
│  Auto-deploys from git main     │    │    └── /etc/nginx/conf.d/        │
│  Global CDN (100+ POPs)         │    │                                  │
│  Free SSL                       │    │  PM2 process manager             │
│  Zero config scaling            │    │    └── vms-backend               │
│                                 │    │         Express port 5001        │
└──────────────┬──────────────────┘    │         max 400MB RAM            │
               │                       │                                  │
               │  API calls over HTTPS │  Swap: 2GB                       │
               └───────────────────────┘
                                            │
External Services:              ┌───────────┴──────────────┐
    ├── MongoDB Atlas            │  MongoDB Atlas (database) │
    ├── AWS S3                   │  AWS S3 (file storage)    │
    └── Gmail SMTP               │  Gmail SMTP (email)       │
                                 └──────────────────────────┘
```

### Process Management (PM2)

```
PM2 monitors both processes:
    │
    ├── Memory > 400MB → auto restart
    ├── Process crash → auto restart (delay: 3s)
    ├── EC2 reboot → PM2 auto-starts (pm2 startup)
    └── Logs → ./logs/backend-*.log, ./logs/frontend-*.log
```

---

## Known Limitations

| # | Limitation | Impact | Priority |
|---|-----------|--------|----------|
| 1 | OTP stored in-memory (Map) | Lost on restart — users mid-verification fail | High |
| 2 | Single EC2 instance | No redundancy — one crash = downtime | High |
| 3 | No WebSocket | Notifications require page refresh | Medium |
| 4 | Sequential DB queries in dashboard | Slower dashboard load | Medium |
| 5 | JWT in localStorage (rememberMe) | XSS risk | Medium |
| 6 | No distributed rate limiting | Rate limit resets on PM2 restart | Low |
| 7 | CORS must allow Vercel domain | Any new Vercel preview URL needs whitelisting | Low |

---

## Future Scaling Roadmap

### Phase 1 — Stability (0–10k users)
*Current architecture, minor improvements*

- [ ] Replace in-memory OTP with **MongoDB TTL index** or **Redis**
- [ ] Add **Cloudflare free tier** (DDoS protection, CDN, free SSL)
- [ ] Add **Winston** structured logging instead of console.log
- [ ] Parallelize dashboard DB queries with `Promise.all()`
- [ ] Add `/api/health` deep check (DB connectivity)

### Phase 2 — Reliability (10k–50k users)
*High availability, no single point of failure*

```
Before:  1 EC2 → Node.js

After:
         AWS ALB (Load Balancer)
              │         │
         EC2 #1      EC2 #2
         (Node.js)   (Node.js)
              │         │
         MongoDB Atlas (shared)
         Redis (shared session/OTP store)
```

- [ ] Move to **2 EC2 instances** behind **AWS ALB**
- [ ] Add **Redis** for OTP storage, session caching, rate limit state
- [ ] **Read replicas** on MongoDB Atlas for dashboard queries
- [ ] **AWS CloudWatch** for monitoring, alerts, auto-scaling triggers

### Phase 3 — Scale (50k–500k users)
*Microservices, async processing*

```
API Gateway
    │
    ├── Auth Service
    ├── Jobs Service
    ├── Notification Service (WebSocket — Socket.io)
    ├── File Service
    └── Email Service ← BullMQ job queue + Redis
                         (async, retry on failure)
```

- [ ] Split monolith into **microservices** (auth, jobs, notifications)
- [ ] **BullMQ + Redis** for email queue (retries, scheduling)
- [ ] **Socket.io** for real-time notifications
- [ ] **AWS SES** instead of Gmail SMTP (higher deliverability, no limits)
- [ ] **ElasticSearch** for job search (full-text, filters, relevance)
- [ ] **CDN** (CloudFront) for Next.js static assets globally

### Phase 4 — Enterprise (500k+ users)
*Full cloud-native*

- [ ] **Kubernetes** (EKS) for container orchestration
- [ ] **Auto-scaling groups** based on CPU/memory metrics
- [ ] **Multi-region** deployment (US + India) with Route 53 geolocation
- [ ] **Event-driven** architecture with **AWS SNS/SQS**
- [ ] **Data warehouse** (Redshift) for analytics separated from operational DB

---

## Summary

| Concern | Current Solution | Scale Limit |
|---------|----------------|-------------|
| Traffic management | Nginx rate limiting | ~300 concurrent users |
| Process reliability | PM2 auto-restart | Single server only |
| Database | MongoDB Atlas pooled | ~10k users comfortably |
| File storage | AWS S3 | Unlimited |
| Auth | JWT stateless | Scales horizontally |
| Email | Gmail SMTP | 500 emails/day limit |
| Real-time | Polling (no WebSocket) | Not suitable for >1k users |
| Monitoring | PM2 logs only | Manual investigation |
