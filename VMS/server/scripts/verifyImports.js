const path = require('path');

try {
    console.log('Testing imports from ' + __dirname);

    // Simulate being in routes folder
    const routesDir = path.join(__dirname, '../routes');
    process.chdir(routesDir);
    console.log('Current directory: ' + process.cwd());

    const auth = require('../middleware/auth');
    console.log('Successfully required ../middleware/auth');

    const User = require('../models/User');
    console.log('Successfully required ../models/User');

    const Job = require('../models/Job');
    console.log('Successfully required ../models/Job');

    console.log('All imports valid.');
} catch (error) {
    console.error('Import failed:', error);
}
