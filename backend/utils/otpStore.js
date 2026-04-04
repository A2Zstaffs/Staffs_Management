// In-memory OTP storage
// In production, consider using Redis or database
const otpStore = new Map();

// OTP configuration
const OTP_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes in milliseconds
const OTP_LENGTH = 6;

// Generate random OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store OTP for email
const storeOTP = (email, otp) => {
    const emailKey = email.toLowerCase();
    const expiryTime = Date.now() + OTP_EXPIRY_TIME;
    otpStore.set(emailKey, {
        otp,
        expiryTime,
        attempts: 0
    });

    console.log(`🔑 OTP stored for ${emailKey}: ${otp} (expires in 10 mins)`);
    console.log(`📊 Current OTP store has ${otpStore.size} entries`);

    // Auto-delete after expiry
    setTimeout(() => {
        if (otpStore.has(emailKey)) {
            otpStore.delete(emailKey);
            console.log(`⏰ OTP expired and removed for ${emailKey}`);
        }
    }, OTP_EXPIRY_TIME);
};

// Verify OTP
const verifyOTP = (email, inputOTP) => {
    const emailKey = email.toLowerCase();
    console.log(`🔍 Verifying OTP for email: "${emailKey}"`);

    // CHECK FOR TEST OTP (FOR DEVELOPMENT/TESTING ONLY)
    // This allows using a default OTP for any email during testing
    // To disable: Set ENABLE_TEST_OTP=false in .env
    const isTestMode = process.env.ENABLE_TEST_OTP === 'true';
    const testOTP = process.env.TEST_OTP || '123456';

    if (isTestMode && inputOTP === testOTP) {
        console.log(`✅ [TEST MODE] Test OTP accepted for ${emailKey}`);
        console.log(`⚠️  WARNING: Test OTP mode is ENABLED. Disable in production!`);
        return { success: true, message: 'OTP verified successfully (test mode)' };
    }

    console.log(`📊 Available emails in store: ${Array.from(otpStore.keys()).join(', ')}`);

    const storedData = otpStore.get(emailKey);

    if (!storedData) {
        console.log(`❌ No OTP found for "${emailKey}"`);
        return { success: false, message: 'OTP not found or expired' };
    }

    // Check expiry
    if (Date.now() > storedData.expiryTime) {
        otpStore.delete(emailKey);
        console.log(`❌ OTP expired for "${emailKey}"`);
        return { success: false, message: 'OTP has expired' };
    }

    // Check attempts (max 5 attempts)
    if (storedData.attempts >= 5) {
        otpStore.delete(emailKey);
        return { success: false, message: 'Too many failed attempts. Please request a new OTP' };
    }

    // Verify OTP
    if (storedData.otp === inputOTP) {
        // Mark as verified but keep in store for password reset
        storedData.verified = true;
        otpStore.set(emailKey, storedData);
        console.log(`✅ OTP verified successfully for ${emailKey}`);
        return { success: true, message: 'OTP verified successfully' };
    } else {
        // Increment attempts
        storedData.attempts += 1;
        otpStore.set(emailKey, storedData);
        console.log(`❌ Invalid OTP attempt ${storedData.attempts}/5 for ${emailKey}`);
        return {
            success: false,
            message: `Invalid OTP. ${5 - storedData.attempts} attempts remaining`
        };
    }
};

// Check if OTP is verified
const isOTPVerified = (email) => {
    const emailKey = email.toLowerCase();
    const storedData = otpStore.get(emailKey);
    return storedData && storedData.verified === true;
};

// Delete OTP after use
const deleteOTP = (email) => {
    const emailKey = email.toLowerCase();
    otpStore.delete(emailKey);
    console.log(`🗑️ OTP deleted for ${email}`);
};

// Get OTP statistics (for debugging)
const getOTPStats = () => {
    return {
        totalStored: otpStore.size,
        emails: Array.from(otpStore.keys())
    };
};

module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP,
    isOTPVerified,
    deleteOTP,
    getOTPStats
};
