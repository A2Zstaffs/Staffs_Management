'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';

export default function VerifyOTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const type = searchParams.get('type'); // 'signup' or 'password-reset'

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        if (!email) {
            router.push('/forgot-password');
        }
    }, [email, router]);

    // Countdown timer for OTP expiration
    useEffect(() => {
        if (timeRemaining <= 0) {
            setIsExpired(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    setIsExpired(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Check if OTP has expired
        if (isExpired) {
            setError('OTP has expired. Please request a new one.');
            return;
        }

        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsLoading(true);

        try {
            // Use different API endpoint based on type
            const endpoint = type === 'signup'
                ? `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-signup-otp`
                : `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, otp: otpCode }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);

                if (type === 'signup') {
                    // Auto-login after signup verification
                    // Backend sends user data in 'data' field, not 'user'
                    const userData = data.data || data.user;

                    if (data.token && userData) {
                        // Store token and user data with correct keys that match API client
                        if (typeof window !== 'undefined') {
                            localStorage.setItem('authToken', data.token); // API client looks for 'authToken'
                            localStorage.setItem('userData', JSON.stringify(userData)); // API client looks for 'userData'
                            localStorage.setItem('userRole', userData.role);
                            localStorage.setItem('userName', userData.fullName || userData.email);
                        }

                        // Redirect to role-specific dashboard
                        setTimeout(() => {
                            const dashboardRoutes = {
                                candidate: '/candidate/home',
                                recruiter: '/recruiter/home',
                                client: '/client/dashboard',
                                consultancy: '/dashboard',
                                admin: '/admin/dashboard',
                                kam: '/kam/dashboard',
                                recruiter_manager: '/recruiter-manager/dashboard'
                            };

                            const redirectPath = dashboardRoutes[userData.role] || '/dashboard';
                            router.push(redirectPath);
                        }, 1500);
                    }
                } else {
                    // Password reset flow - redirect to reset password page
                    setTimeout(() => {
                        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
                    }, 1500);
                }
            } else {
                setError(data.message || 'Invalid OTP');
            }
        } catch (err) {
            console.error('Verify OTP error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setError('');
        setIsLoading(true);

        try {
            // Use different API endpoint based on type
            const endpoint = type === 'signup'
                ? `${process.env.NEXT_PUBLIC_API_URL}/auth/resend-signup-otp`
                : `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (data.success) {
                setOtp(['', '', '', '', '', '']);
                setTimeRemaining(300); // Reset timer to 5 minutes
                setIsExpired(false);
                alert('New OTP sent to your email!');
            } else {
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            console.error('Resend OTP error:', err);
            setError('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full animated-background-light flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Main Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow-xl p-8 border border-white/20">
                    {/* Back Button */}
                    <Link
                        href="/forgot-password"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Link>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {type === 'signup' ? 'Verify Your Email' : 'Verify OTP'}
                        </h1>
                        <p className="text-gray-600">
                            {type === 'signup'
                                ? 'Enter the verification code sent to'
                                : 'Enter the 6-digit code sent to'}
                            <br />
                            <span className="font-medium text-gray-900">{email}</span>
                        </p>
                        {/* Timer Display */}
                        <div className={`mt-4 text-center p-3 rounded-lg ${isExpired ? 'bg-red-50 border border-red-200' :
                            timeRemaining <= 60 ? 'bg-orange-50 border border-orange-200' :
                                'bg-blue-50 border border-blue-200'
                            }`}>
                            <div className="flex items-center justify-center gap-2">
                                <svg className={`w-5 h-5 ${isExpired ? 'text-red-600' :
                                    timeRemaining <= 60 ? 'text-orange-600' :
                                        'text-blue-600'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className={`font-semibold ${isExpired ? 'text-red-700' :
                                    timeRemaining <= 60 ? 'text-orange-700' :
                                        'text-blue-700'
                                    }`}>
                                    {isExpired ? 'OTP Expired' :
                                        <>
                                            {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')} remaining
                                        </>
                                    }
                                </span>
                            </div>
                            {isExpired && (
                                <p className="text-xs text-red-600 mt-1">Request a new OTP to continue</p>
                            )}
                        </div>
                    </div>

                    {success ? (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                            <p className="font-medium">
                                {type === 'signup' ? 'Email Verified!' : 'OTP Verified Successfully!'}
                            </p>
                            <p className="text-sm mt-1">
                                {type === 'signup' ? 'Logging you in...' : 'Redirecting to reset password...'}
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* OTP Input */}
                            <div className="flex justify-center gap-2">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                                        disabled={isLoading}
                                    />
                                ))}
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </button>

                            {/* Resend OTP */}
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={isLoading}
                                    className="text-primary-500 hover:text-primary-700 font-medium text-sm disabled:opacity-50"
                                >
                                    Didn't receive code? Resend OTP
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
