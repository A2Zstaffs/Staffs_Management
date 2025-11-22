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
      dbName: dbName // This will override if database is in URI
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error(' MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('  MongoDB disconnected');
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
