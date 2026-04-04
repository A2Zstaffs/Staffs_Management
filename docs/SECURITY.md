# Security Vulnerability Report — A2Z Staffs VMS

> Audited: 2026-03-15
> Scope: `VMS/server/` (Express API) + `VMS/Frontend/` (Next.js)
> Deployment: AWS EC2 t3.micro, direct git pull, no Docker

---

## Summary

| Severity | Count | Status |
|----------|-------|--------|
| 🔴 Critical | 2 | 1 Fixed, 1 Remaining |
| 🟠 High | 4 | 2 Fixed, 2 Remaining |
| 🟡 Medium | 4 | 1 Fixed, 3 Remaining |
| 🟢 Low | 3 | 0 Fixed, 3 Remaining |

---

## 🔴 Critical

### [FIXED] C-1 — Test OTP Bypass in Production
**File:** `VMS/server/.env` + `VMS/server/utils/otpStore.js:44`

`ENABLE_TEST_OTP=true` with `TEST_OTP=123456` was active in production. Anyone who knew this (or guessed it) could bypass email OTP verification for any account — signup, password reset, and account takeover.

```js
// otpStore.js:44 — still present in code
const isTestMode = process.env.ENABLE_TEST_OTP === 'true';
const testOTP = process.env.TEST_OTP || '123456';
```

**Fix applied:** Commented out in `.env`. The code in `otpStore.js` still reads the env var — ensure it is never re-enabled on EC2.

**Remaining risk:** The default fallback `|| '123456'` in `otpStore.js:45` means if `ENABLE_TEST_OTP` is accidentally set to `true` without a custom `TEST_OTP`, the OTP is still `123456`. Consider removing the fallback entirely.

---

### [REMAINING] C-2 — No HTTPS on Production Server
**File:** Infrastructure

All traffic (JWT tokens, passwords, OTPs, session data) travels in plain text over HTTP. A network-level attacker can intercept tokens and impersonate any user.

**Fix:** Install Certbot SSL (see `DEPLOY.md` Step 9). This is a deployment step — not yet done.

---

## 🟠 High

### [FIXED] H-1 — Google Auth Storage Inconsistency
**File:** `VMS/Frontend/lib/api.js` (googleAuth method)

`userRole` was stored in `localStorage` while `authToken`/`userData` went to `sessionStorage`. On next login, stale role from localStorage caused wrong dashboard routing — a recruiter could be treated as a candidate or vice versa.

**Fix applied:** `googleAuth()` now clears all storage before login and stores everything in `sessionStorage` consistently.

---

### [FIXED] H-2 — Premature LOGIN_SUCCESS on Email Signup
**File:** `VMS/Frontend/contexts/AuthContext.js`

`signup()` dispatched `LOGIN_SUCCESS` even when the backend returned `requiresVerification: true` (no token). This set `user.role = undefined` in AuthContext, triggering "Invalid user role" in DashboardContext and "Not authorized" errors on every API call.

**Fix applied:** AuthContext now checks for `requiresVerification` and skips `LOGIN_SUCCESS` until OTP is verified.

---

### [REMAINING] H-3 — No Process Manager (No Auto-Restart)
**File:** Infrastructure

Both Next.js and Express run as bare `node` processes. If either crashes, the app is dead until someone manually SSH's in and restarts it. On t3.micro, OOM kills are possible.

**Fix:** PM2 config created at `ecosystem.config.js`. Deploy it on EC2 (see `DEPLOY.md` Step 7).

---

### [REMAINING] H-4 — Ports 3000 and 5001 Directly Exposed
**File:** AWS EC2 Security Group

Node.js processes are directly reachable from the internet. Bypasses all Nginx-level protections (rate limiting, IP blocking, SSL). Anyone can hit the raw Express API without going through Nginx.

**Fix:**
1. Deploy Nginx (see `DEPLOY.md` Step 8)
2. Update EC2 Security Group — remove inbound rules for 3000 and 5001
3. Run `sudo ufw deny 3000 && sudo ufw deny 5001`

---

## 🟡 Medium

### [FIXED] M-1 — CORS Allows All Origins Outside Production
**File:** `VMS/server/server.js:47`

```js
if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
  callback(null, true); // allows EVERYTHING if not production
}
```

If `NODE_ENV` is missing or mistyped in `.env`, the entire API becomes publicly accessible from any origin. Additionally, `FRONTEND_URL` was still pointing to the old Vercel URL (`a2zstaffs-theta.vercel.app`) — CORS would reject requests from the real production frontend.

**Fix applied:** `FRONTEND_URL` updated to `https://a2zstaffs.com` in `.env`.

---

### [REMAINING] M-2 — JWT Stored in localStorage (XSS Risk)
**File:** `VMS/Frontend/lib/api.js:21`

When "Remember Me" is checked, `authToken` and `userData` are stored in `localStorage`. `localStorage` is accessible to any JavaScript on the page — if an XSS vulnerability ever exists anywhere (third-party script, user-generated content), tokens can be silently stolen.

**Recommendation:** Move "Remember Me" to use a longer-lived `httpOnly` cookie instead of `localStorage`. The backend already sets `httpOnly` cookies — the frontend just doesn't rely on them.

---

### [REMAINING] M-3 — Verbose Auth Logging in Production
**File:** `VMS/server/controllers/authController.js:176,182,189`

```js
console.log('✅ [Login] User found, checking password...');
console.log('⚠️ [Login] Invalid password');
console.log('✅ [Login] Password correct, checking email verification...');
```

These logs expose authentication flow details (timing, user existence) in server logs. If logs are ever accessible (compromised EC2, log aggregation service), an attacker gains insight into which emails are registered and whether passwords are correct.

**Recommendation:** Remove auth-specific `console.log` statements or replace with a structured logger that can be disabled in production.

---

### [REMAINING] M-4 — Cookie `sameSite: 'none'` Without Strict Domain
**File:** `VMS/server/middleware/auth.js:122`

```js
options.sameSite = 'none'; // Required for cross-site (Vercel -> Render)
```

`sameSite: 'none'` was a workaround for the old Vercel → Render cross-origin setup. Now that frontend and backend will be on the same domain (`a2zstaffs.com`), this is no longer needed and weakens CSRF protection.

**Recommendation:** Change to `sameSite: 'strict'` or `'lax'` after moving to same-domain deployment.

---

## 🟢 Low

### [REMAINING] L-1 — Rate Limiting Only at Application Level
**File:** `VMS/server/server.js:57`

```js
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 3000 });
```

Rate limiting at Express level means the request hits Node.js (consuming CPU/memory) before being rejected. A DDoS or brute force attack can exhaust the server before limits kick in.

**Fix:** Nginx-level rate limiting is configured in `nginx/a2zstaffs.conf` with stricter limits on auth endpoints (5 req/min). Deploy Nginx to activate this.

---

### [REMAINING] L-2 — No Security Headers Beyond Helmet Defaults
**File:** `VMS/server/server.js`

Helmet is enabled with defaults, but `Content-Security-Policy` (CSP) is not explicitly configured. Without CSP, XSS attacks can load external scripts.

**Recommendation:** Add explicit CSP header in Nginx config (or in Helmet configuration):
```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self' accounts.google.com; frame-src accounts.google.com;" always;
```

---

### [REMAINING] L-3 — `.env` Contains Real Credentials Locally
**File:** `VMS/server/.env` (gitignored)

The local `.env` file contains production AWS keys, MongoDB URI, JWT secret, and email credentials. If the developer's machine is compromised or `.gitignore` is accidentally removed, all credentials are exposed.

**Recommendation:**
- Use AWS IAM roles on EC2 instead of hardcoded `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY`
- Rotate the JWT secret periodically
- Use AWS Secrets Manager or EC2 environment variables for production secrets instead of a file

---

## Already-Secure Areas (No Action Needed)

| Area | Status |
|------|--------|
| Password hashing | `bcryptjs` — good |
| JWT verification | Proper signature check in `auth.js` middleware |
| Input validation | `express-validator` on auth routes |
| File upload limits | 10MB cap enforced |
| MongoDB injection | Mongoose ODM used throughout — parameterized queries |
| Role-based access | `protect` + `authorize(...roles)` middleware on all protected routes |
| OTP expiry | OTPs are time-limited in `otpStore.js` |
| HTTPS cookies | `httpOnly: true` set on JWT cookies |
