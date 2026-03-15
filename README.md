# A2Z Staffs - VMS (Vendor Management System)

A comprehensive staffing and recruitment management platform.

---

## Recent Updates

### JWT Authentication Improvements (Feb 6, 2026)

**Session-based Token Expiry** - Tokens now have different expiration times based on "Remember Me" selection:

| Login Type | Token Expiry | Cookie Expiry |
|------------|--------------|---------------|
| Regular Session | 1 hour | 1 hour |
| Remember Me ✓ | 7 days | 7 days |

**Environment Variables:**
```bash
JWT_SECRET=<your-secure-random-string>
JWT_EXPIRE=1h              # Regular session expiry
JWT_EXPIRE_REMEMBER=7d     # "Remember Me" expiry
```

**Files Modified:**
- `server/middleware/auth.js` - `getSignedJwtToken()` now accepts `rememberMe` parameter
- `server/controllers/authController.js` - Login reads `rememberMe` from request
- `Frontend/lib/api.js` - Sends `rememberMe` flag to backend

---

### Admin Dashboard Redesign (Feb 6, 2026)

**Data-Driven Dashboard** - Complete redesign focused on real-time insights:

| Section | Description |
|---------|-------------|
| Stat Cards | Real counts from database (Recruiters, Clients, Jobs, Profiles, Pipeline Value) |
| Charts | Area chart for trends, Donut chart for job status distribution |
| Pending Actions | Actionable items (Job Approvals, Unassigned Clients/Recruiters, CVs in Review) |
| Recent Activity | Real notifications from the system |
| Quick Actions | Navigation grid to admin sections |

**Removed:** System Health section (replaced with actionable Pending Actions)

**Files Modified:**
- `Frontend/app/admin/page.js` - Complete rewrite with real API data
- `Frontend/app/admin/components/PendingActionsCard.js` - New component
- `Frontend/app/admin/components/RecentActivityFeed.js` - Uses real notifications
- `Frontend/app/admin/data/adminData.js` - Removed mock data

---

### Reports Export (Feb 6, 2026)

**Functional Exports** at `/admin/reports`:

| Export Type | Format | Contents |
|-------------|--------|----------|
| Monthly Report | PDF | Styled tables with summary, jobs, pipeline, top recruiters |
| All Data | CSV | Flat export with all metrics and detailed job list |

**Charts Added:**
- Jobs by Status (donut)
- CV Pipeline Distribution (bar)
- Monthly Signups (grouped bar)
- Top Recruiters by Submissions (horizontal bar)

**Dependencies Added:** `jspdf`, `jspdf-autotable`

**Files Modified:** `Frontend/app/admin/reports/page.js`

---

### Admin Panel Fixes (Feb 6, 2026)

**1. Removed Hardcoded Admin Emails:**
- Login placeholder changed from `admin@a2zstaffs.com` → `Enter admin email`
- Sidebar and header now show actual logged-in user's name/email

**2. Functional Notifications:**
- Fetches real notifications from API
- Click notification → marks as read and hides it
- "Mark all read" button clears all notifications
- Badge only shows when there are unread notifications

**Files Modified:**
- `Frontend/app/admin/login/page.js`
- `Frontend/app/admin/components/AdminSidebar.js`
- `Frontend/app/admin/components/GradientHeader.js`

---

### Dashboard Context Fix (Feb 6, 2026)

Fixed "Invalid user role" error when logging in as admin/KAM/recruiter_manager.

**Problem:** `DashboardContext` didn't handle admin roles, causing errors on login.

**Solution:** Added cases for `admin`, `kam`, and `recruiter_manager` to skip generic dashboard fetch (they have dedicated dashboards).

**File Modified:** `Frontend/contexts/DashboardContext.js`

---

### KAM Dashboard Login Fix (Jan 30, 2026)

**Issue:** KAM users not redirected to dashboard when "Remember Me" was unchecked.

**Root Cause:** Auth check only looked in `localStorage`, but non-Remember Me sessions use `sessionStorage`.

**Solution:** Auth checks now look in `sessionStorage` first, then `localStorage`:
```javascript
const token = sessionStorage.getItem('authToken') || localStorage.getItem('authToken');
```

**File Modified:** `Frontend/app/kam/layout.js`

---

## User Roles

| Role | Dashboard Route | Description |
|------|-----------------|-------------|
| `admin` | `/admin` | Full system administration |
| `kam` | `/kam` | Key Account Manager |
| `recruiter_manager` | TBD | Manages recruiters |
| `recruiter` | `/recruiter` | Recruiter dashboard |
| `client` | `/client` | Client dashboard |
| `candidate` | `/candidate` | Candidate dashboard |
| `consultancy` | TBD | Consultancy dashboard |

---

## Development

```bash
# Start backend
cd VMS/server
npm run dev

# Start frontend
cd VMS/Frontend
npm run dev
```

**Backend:** http://localhost:5001  
**Frontend:** http://localhost:3000
