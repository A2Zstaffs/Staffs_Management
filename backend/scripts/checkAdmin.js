/**
 * Script to check if admin user exists in MongoDB
 * Run this to verify admin account
 * 
 * Usage: node checkAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME || 'vms_db'
        });
        console.log('✅ MongoDB Connected');
    } catch (error) {
        console.error('❌ MongoDB Connection Error:', error);
        process.exit(1);
    }
};

// User Schema
const userSchema = new mongoose.Schema({
    fullName: String,
    email: String,
    password: String,
    role: String,
    phoneNumber: String,
    company: String,
    profileCompleted: Boolean,
    isActive: Boolean,
    createdAt: Date
});

const User = mongoose.model('User', userSchema);

// Check Admin User
const checkAdminUser = async () => {
    try {
        const admin = await User.findOne({ email: 'admin@a2zstaffs.com' });

        if (!admin) {
            console.log('❌ Admin user NOT found in database!');
            console.log('Run createAdmin.js to create the admin user.');
            return;
        }

        console.log('\n✅ Admin user found in database!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', admin.email);
        console.log('👤 Name:', admin.fullName);
        console.log('🎭 Role:', admin.role);
        console.log('✅ Active:', admin.isActive);
        console.log('📅 Created:', admin.createdAt);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    } catch (error) {
        console.error('❌ Error checking admin user:', error);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await checkAdminUser();
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
};

main();
