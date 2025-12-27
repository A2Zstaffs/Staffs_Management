const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Build connection string with database name if not already included
    let mongoUri = process.env.MONGODB_URI;
    const dbName = process.env.DB_NAME || 'a2zstaffs_vms';

    // If using MongoDB Atlas (mongodb+srv://), ensure database name is in the connection string
    if (mongoUri && mongoUri.includes('mongodb+srv://')) {
      // If database name is not in the URI, add it
      if (!mongoUri.includes('/' + dbName) && !mongoUri.includes('/?')) {
        // Replace ? with /dbname? or add /dbname before ?
        mongoUri = mongoUri.replace(/\?/, `/${dbName}?`);
      } else if (mongoUri.endsWith('/')) {
        mongoUri = mongoUri + dbName;
      }
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: dbName, // This will override if database is in URI
      // Connection pool settings
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 2,  // Minimum number of connections to maintain
      // Timeout settings
      serverSelectionTimeoutMS: 30000, // 30 seconds to select a server
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      connectTimeoutMS: 30000, // 30 seconds connection timeout
      // Keep alive settings to prevent connection drops
      keepAlive: true,
      keepAliveInitialDelay: 300000, // 5 minutes
      // Retry settings
      retryWrites: true,
      retryReads: true
    });

    console.log(`✅ MongoDB: ${conn.connection.name} @ ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected successfully');
    });

    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('MongoDB connection failed:', error.message);

    // Don't exit the process, just log the error
    // This prevents the server from crashing when MongoDB is unreachable
    console.log(' Server will continue without database connection');
    console.log(' Please check your MongoDB connection and restart the server');
  }
};

module.exports = connectDB;
