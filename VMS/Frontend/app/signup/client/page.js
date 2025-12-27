'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ClientSignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long!");
      return;
    }

    // Check password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number!");
      return;
    }

    setIsLoading(true);

    try {
      const signupData = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: 'client'
      };

      const result = await signup(signupData);

      if (result.success) {
        // Save role explicitly to localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', 'client');
        }
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          router.push('/client/dashboard');
        }, 100);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      // Provide user-friendly error messages
      let errorMessage = 'An error occurred during registration. Please try again.';

      if (err.message.includes('Cannot connect to the server') || err.message.includes('Failed to fetch')) {
        errorMessage = 'Cannot connect to the server. Please make sure the backend server is running on http://localhost:5001';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 -mt-16 pt-16">
      <div className="w-full max-w-xl">
        {/* Form Card - Glass Effect */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] border border-white/40 p-6">
          {/* Role Badge */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-1.5 bg-primary-100 text-primary-800 rounded-full text-xs font-medium">
              <div className="w-1.5 h-1.5 bg-primary-500 rounded-full mr-2"></div>
              Client Registration
            </div>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fullName" className="block text-xs font-medium text-secondary-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 text-sm focus:bg-white/90"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-medium text-secondary-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="username@gmail.com"
                  className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 text-sm focus:bg-white/90"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-xs font-medium text-secondary-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 pr-8 text-sm focus:bg-white/90"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs font-medium text-secondary-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    className="w-full px-3 py-2.5 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 pr-8 text-sm focus:bg-white/90"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {isLoading ? 'Registering...' : 'Register as Client'}
              </button>
            </div>
          </form>

          {/* Separator */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-secondary-300"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-transparent text-secondary-500">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="flex justify-center space-x-3 mb-4">
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-secondary-300 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200">
              <span className="text-secondary-700 font-bold text-xs">G</span>
            </button>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-secondary-300 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200">
              <svg className="w-4 h-4 text-secondary-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>
            <button className="w-10 h-10 bg-white/80 backdrop-blur-sm border border-secondary-300 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200">
              <span className="text-secondary-700 font-bold text-xs">f</span>
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs text-secondary-500">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-500 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
