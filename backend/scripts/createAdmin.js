/**
 * Script to create an admin user in MongoDB
 * Run this script once to create the admin account
 * 
 * Usage: node createAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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

// User Schema (simplified version)
const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['client', 'recruiter', 'admin'], required: true },
    phoneNumber: String,
    company: String,
    profileCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Create Admin User
const createAdminUser = async () => {
    try {
        // Admin credentials
        const adminData = {
            fullName: 'Admin',
            email: 'admin@a2zstaffs.com',
            password: 'Admin@123', // Change this password after first login!
            role: 'admin',
            phoneNumber: '+1234567890',
            company: 'A2Z Staffs',
            profileCompleted: true,
            isActive: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log('📧 Email:', adminData.email);
            console.log('🔑 If you forgot the password, delete this user and run the script again.');
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        adminData.password = await bcrypt.hash(adminData.password, salt);

        // Create admin user
        const admin = await User.create(adminData);

        console.log('\n✅ Admin user created successfully!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:    admin@a2zstaffs.com');
        console.log('🔑 Password: Admin@123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('⚠️  IMPORTANT: Change this password after first login!');
        console.log('🔗 Login at: http://localhost:3000/admin/login\n');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    }
};

// Main execution
const main = async () => {
    await connectDB();
    await createAdminUser();
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
};

main();
