/**
 * Rotate a user's password.
 *
 * Usage:
 *   ADMIN_EMAIL=admin@a2zstaffs.com node backend/scripts/rotateAdminPassword.js
 *
 * The script prompts for the new password with hidden input (same technique
 * sudo/ssh use), so the plaintext never appears on the command line, in
 * shell history, or echoed to the terminal — and no shell-specific `read -s`
 * gymnastics are needed.
 *
 * The User model has a pre-save bcrypt hook (models/User.js:226), so we
 * just assign the plaintext and call save() — the hook does the hashing.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const readline = require('readline');
const User = require('../models/User');

// Prompt for input on the TTY with keystrokes suppressed from echo.
// Same _writeToOutput trick used by getpass-style libraries.
const promptHidden = (question) => new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
        return reject(new Error('stdin is not a TTY — pipe input is not supported. Run this script interactively.'));
    }
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    process.stdout.write(question);
    rl._writeToOutput = () => {};   // suppress echo
    rl.question('', (answer) => {
        rl.close();
        process.stdout.write('\n');
        resolve(answer);
    });
});

const main = async () => {
    const email = process.env.ADMIN_EMAIL;

    if (!email) {
        console.error('❌ ADMIN_EMAIL env var is required.');
        console.error('   Example: ADMIN_EMAIL=admin@a2zstaffs.com node backend/scripts/rotateAdminPassword.js');
        process.exit(2);
    }

    const newPassword = await promptHidden(`New password for ${email} (hidden): `);
    const confirmPassword = await promptHidden('Confirm new password (hidden): ');

    if (newPassword !== confirmPassword) {
        console.error('❌ Passwords do not match. Aborted.');
        process.exit(2);
    }
    if (newPassword.length < 12) {
        console.error('❌ Password must be at least 12 characters. Generate one with: openssl rand -base64 24');
        process.exit(2);
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: process.env.DB_NAME
        });
        console.log('✅ MongoDB connected');

        // Need +password because the schema has select:false on the field
        const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            console.error(`❌ No user found with email "${email}"`);
            process.exit(3);
        }

        console.log(`Found user: ${user.email}  role=${user.role}  _id=${user._id}`);

        user.password = newPassword;
        await user.save();   // pre-save hook hashes via bcrypt

        console.log('✅ Password rotated successfully.');
        console.log('   Verify by logging in with the new password, then update');
        console.log('   any password managers / runbooks pointing at the old one.');
    } catch (err) {
        console.error('❌ Rotation failed:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

main();
