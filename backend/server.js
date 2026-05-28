// @ts-nocheck
const express = require('express');
const cors = require('cors');
const helmet = require('helmet').default;
const { rateLimit } = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config();

// Import custom modules
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Route files
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();

// Trust proxy (required for Render)
app.set('trust proxy', 1);

// Connect to database
connectDB();

// Security middleware
app.use(helmet());
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://a2zstaffs.com',
  'https://www.a2zstaffs.com',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
app.use(cors(corsOptions));

// Rate limiting - more permissive in development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 3000 : 1000, // 1000 requests in dev, 3000 in production
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  skip: (req) => {
    // Skip rate limiting for health checks
    return req.path === '/api/health';
  }
});

app.use('/api/', limiter);



// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware - show status code and URL for API requests
app.use((req, res, next) => {
  res.on('finish', () => {
    if (req.originalUrl.startsWith('/api/')) {
      const statusCode = res.statusCode;
      const method = req.method;
      const url = req.originalUrl;

      // Color coding: green for success, yellow for redirect, red for error
      let color = '\x1b[32m'; // green for 2xx
      if (statusCode >= 500) color = '\x1b[31m'; // red for 5xx
      else if (statusCode >= 400) color = '\x1b[31m'; // red for 4xx
      else if (statusCode >= 300) color = '\x1b[33m'; // yellow for 3xx

      const reset = '\x1b[0m';
      console.log(`${color}${statusCode}${reset} ${method} ${url}`);
    }
  });

  next();
});

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'A2ZStaffs VMS Backend Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount routers
const dashboardRoutes = require('./routes/dashboard');
const jobRoutes = require('./routes/jobs');
const profileRoutes = require('./routes/profiles');
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/profiles', profileRoutes);
const clientRoutes = require('./routes/client.routes');
app.use('/api/client', clientRoutes);
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);
const kamRoutes = require('./routes/kamRoutes');
app.use('/api/kam', kamRoutes);
const recruiterManagerRoutes = require('./routes/recruiterManagerRoutes');
app.use('/api/recruiter-manager', recruiterManagerRoutes);
const notificationRoutes = require('./routes/notifications');
app.use('/api/notifications', notificationRoutes);

// Handle 404 routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  const message = err instanceof Error ? err.message : String(err);
  console.log(`⚠️ Unhandled Rejection: ${message}`);
  if (process.env.NODE_ENV === 'production') {
    server.close(() => {
      process.exit(1);
    });
  }
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  const message = err instanceof Error ? err.message : String(err);
  console.log(`⚠️ Uncaught Exception: ${message}`);
  if (process.env.NODE_ENV === 'production') {
    console.log('Shutting down the server due to uncaught exception');
    process.exit(1);
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully');
  server.close(() => {
    console.log('💤 Process terminated');
  });
});

module.exports = app;