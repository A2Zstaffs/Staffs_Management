const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vms');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Test users data
const testUsers = [
  {
    fullName: 'Abhishek Kumar',
    email: 'abhishek@gmail.com',
    password: 'password123',
    phoneNumber: '+1-555-0101',
    role: 'candidate',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'USA'
    },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    experience: '2-5'
  },
  {
    fullName: 'Sarah Johnson',
    email: 'sarah@gmail.com',
    password: 'password123',
    phoneNumber: '+1-555-0102',
    role: 'recruiter',
    company: 'TechRecruit Inc.',
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'USA'
    },
    companyDetails: {
      size: '51-200',
      industry: 'Technology',
      website: 'https://techrecruit.com',
      description: 'Leading tech recruitment agency'
    }
  },
  {
    fullName: 'Mike Chen',
    email: 'mike@gmail.com',
    password: 'password123',
    phoneNumber: '+1-555-0103',
    role: 'client',
    company: 'InnovateCorp',
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'USA'
    },
    businessDetails: {
      type: 'enterprise',
      size: '201-500',
      industry: 'Software Development'
    },
    financials: {
      budget: '100k-500k'
    }
  },
  {
    fullName: 'Lisa Rodriguez',
    email: 'lisa@gmail.com',
    password: 'password123',
    phoneNumber: '+1-555-0104',
    role: 'consultancy',
    company: 'GlobalHR Solutions',
    location: {
      city: 'Chicago',
      state: 'IL',
      country: 'USA'
    }
  },
  {
    fullName: 'John Doe',
    email: 'john@gmail.com',
    password: 'password123',
    phoneNumber: '+1-555-0105',
    role: 'candidate',
    location: {
      city: 'Los Angeles',
      state: 'CA',
      country: 'USA'
    },
    skills: ['Python', 'Django', 'PostgreSQL', 'AWS'],
    experience: '6-10'
  },
  // NOTE: Admin user is intentionally NOT seeded here.
  // Admins must be created via `backend/scripts/createAdmin.js` with an explicit
  // ADMIN_PASSWORD env var, so a hardcoded admin credential never reaches GitHub history.
];

const createTestUsers = async () => {
  try {
    await connectDB();

    console.log('Creating test users...');

    // Clear existing test users (optional - remove this if you want to keep existing data)
    await User.deleteMany({
      email: { $in: testUsers.map(user => user.email) }
    });

    // Create new test users
    for (const userData of testUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created user: ${user.fullName} (${user.email}) - ${user.role}`);
    }

    console.log('\n🎉 Test users created successfully!');
    console.log('\nYou can now login with any of these credentials:');
    console.log('=====================================');
    testUsers.forEach(user => {
      console.log(`Email: ${user.email}`);
      console.log(`Password: ${user.password}`);
      console.log(`Role: ${user.role}`);
      console.log('---');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error creating test users:', error);
    process.exit(1);
  }
};

createTestUsers();
