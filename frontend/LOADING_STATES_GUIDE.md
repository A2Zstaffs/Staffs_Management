# Loading States Implementation

This document provides examples and usage guide for the loading components.

## 📦 Components Created

### 1. LoadingSpinner

**Path**: `/components/LoadingSpinner.js`

A versatile loading indicator with multiple variants.

#### Variants:

- **`spinner`**: Standard rotating circular spinner
- **`logo`**: Animated A2Z logo with pulse effect (brand-focused)
- **`dots`**: Bouncing dots animation
- **`pulse`**: Pulsing circle

#### Props:

| Prop           | Type    | Default          | Description                                 |
| -------------- | ------- | ---------------- | ------------------------------------------- |
| `variant`    | string  | `'spinner'`    | Type of loading animation                   |
| `size`       | string  | `'md'`         | Size:`'sm'`, `'md'`, `'lg'`, `'xl'` |
| `message`    | string  | `'Loading...'` | Text to display below spinner               |
| `fullScreen` | boolean | `false`        | Show as full-screen overlay                 |
| `className`  | string  | `''`           | Additional CSS classes                      |

#### Usage Examples:

```javascript
import LoadingSpinner from '@/components/LoadingSpinner';

// Basic spinner
<LoadingSpinner />

// Logo with custom message (great for dashboards)
<LoadingSpinner 
  variant="logo" 
  size="xl" 
  message="Loading your command center..." 
  fullScreen 
/>

// Dots animation (subtle, good for inline loading)
<LoadingSpinner variant="dots" size="sm" message="" />

// Large pulse spinner
<LoadingSpinner variant="pulse" size="lg" />
```

---

### 2. LoadingSkeleton

**Path**: `/components/LoadingSkeleton.js`

Provides skeleton loading states for different content types with shimmer animation.

#### Types:

- **`card`**: Job cards or general content cards
- **`stats`**: Dashboard statistics cards
- **`table`**: Table rows
- **`list`**: List items

#### Props:

| Prop      | Type   | Default    | Description                      |
| --------- | ------ | ---------- | -------------------------------- |
| `type`  | string | `'card'` | Type of skeleton layout          |
| `count` | number | `3`      | Number of skeleton items to show |

#### Usage Examples:

```javascript
import LoadingSkeleton from '@/components/LoadingSkeleton';

// Job cards skeleton (3x2 grid on larger screens)
<LoadingSkeleton type="card" count={6} />

// Dashboard stats (4 column grid)
<LoadingSkeleton type="stats" count={4} />

// Table rows
<table>
  <thead>...</thead>
  <LoadingSkeleton type="table" count={5} />
</table>

// List items
<LoadingSkeleton type="list" count={8} />
```

---

## 🎯 Implementation Examples

### Example 1: Featured Jobs Component

**File**: `/components/homepage/FeaturedJobs.js`

Shows skeleton cards while fetching jobs data:

```javascript
if (loading) {
  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-500 mb-4">
            Featured Jobs
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Discover the latest opportunities from top companies
          </p>
        </div>
        <LoadingSkeleton type="card" count={6} />
      </div>
    </section>
  );
}
```

### Example 2: Client Dashboard

**File**: `/app/client/dashboard/page.js`

Shows logo-based full-screen loading:

```javascript
if (isLoading) {
  return (
    <LoadingSpinner 
      variant="logo" 
      size="xl" 
      message="Loading your command center..." 
      fullScreen 
    />
  );
}
```

---

## 🎨 Design Rationale

### Why Skeleton Screens?

- **Better perceived performance**: Users see content structure immediately
- **Reduced cognitive load**: Users know what to expect
- **Professional appearance**: More polished than simple spinners

### Why Logo Animation?

- **Brand reinforcement**: Shows the A2Z logo during loading
- **Premium feel**: Pulsing animation creates a modern, dynamic effect
- **User assurance**: Confirms the app is working, not frozen

### Why Multiple Variants?

Different loading contexts need different solutions:

- **Full page loads** → Logo variant (full-screen)
- **Data fetching** → Skeleton screens (show structure)
- **Small actions** → Spinner or dots (inline, unobtrusive)

---

## 🚀 Recommended Usage Patterns

### Pattern 1: Page-Level Loading

For entire page loads (dashboards, profiles):

```javascript
{isLoading && <LoadingSpinner variant="logo" fullScreen />}
```

### Pattern 2: Section Loading

For specific sections (job lists, stats):

```javascript
{isLoading ? (
  <LoadingSkeleton type="card" count={6} />
) : (
  // Actual content
)}
```

### Pattern 3: Inline Button Loading

For button actions:

```javascript
<button disabled={isSubmitting}>
  {isSubmitting ? (
    <>
      <LoadingSpinner variant="dots" size="sm" message="" />
      <span>Processing...</span>
    </>
  ) : (
    'Submit'
  )}
</button>
```

---

## 📝 Next Steps

To add loading states to more pages:

1. **Identify data fetching points** (useEffect, API calls)
2. **Add loading state**: `const [isLoading, setLoading] = useState(true)`
3. **Choose appropriate component**:
   - Full page? → `LoadingSpinner` with `fullScreen`
   - List/cards? → `LoadingSkeleton`
   - Small action? → `LoadingSpinner` (dots/spinner variant)
4. **Implement conditional rendering**

---

## ✅ Files Modified

- ✅ Created `/components/LoadingSpinner.js`
- ✅ Created `/components/LoadingSkeleton.js`
- ✅ Updated `/components/homepage/FeaturedJobs.js`
- ✅ Updated `/app/client/dashboard/page.js`
