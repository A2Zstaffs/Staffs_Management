'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'recruiter', // Default to recruiter
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation 
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
      
    setIsLoading(true);
    setErrors({}); // Clear previous errors
    console.log("hey this is ajay")

    try {
      // Use AuthContext login function
      const response = await login({
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      if (response.success) {
        // Extract user data from response (check both 'user' and 'data' fields for compatibility)
        const userData = response.data || response.user;
        const userRole = userData?.role || formData.role;
        const userName = userData?.fullName;
        
        // Save JWT token, role, and candidate name to localStorage
        // This ensures navbar and protected routes can access auth data immediately
        if (typeof window !== 'undefined') {
          // Token is already saved by authAPI.login, but ensure role and name are saved
          if (userRole) {
            localStorage.setItem('userRole', userRole);
          }
          if (userName) {
            localStorage.setItem('userName', userName);
          }
        }
        
        // Small delay to ensure auth state is updated
        setTimeout(() => {
          // Redirect based on role - candidates go to home page (TalentXO-style)
          const redirectPaths = {
            admin: '/admin',
            recruiter: '/recruiter/home',
            candidate: '/candidate/home',
            client: '/dashboard',
            consultancy: '/dashboard'
          };
          
          router.push(redirectPaths[userRole] || '/recruiter/home');
        }, 100);
      } else {
        setErrors({ 
          general: response.error || 'Invalid email or password. Please check your credentials and try again.' 
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ 
        general: error.message || 'Login failed. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };
   console .log("hey this is ajay")
  return (
    <div className="min-h-screen flex overflow-hidden -mt-16 pt-16">
      {/* Left side - Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Form Card - Glass Effect */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
            {/* Logo */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-secondary-800 mb-2">Your logo</h2>
            </div>

            {/* Login Heading */}
            <h1 className="text-3xl font-bold text-secondary-800 mb-8">Login</h1>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="username@gmail.com"
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-secondary-500 ${
                    errors.email ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
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
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-secondary-500 pr-10 ${
                      errors.password ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-2">
                  Login as
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900"
                  required
                >
                  <option value="recruiter">Recruiter</option>
                  <option value="candidate">Candidate</option>
                  <option value="client">Client</option>
                  <option value="consultancy">Consultancy</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Link href="#" className="text-sm text-secondary-500 hover:text-primary-500">
                  Forgot Password?
                </Link>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-transparent text-secondary-500">or continue with</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="flex justify-center space-x-4 mb-6">
              <button className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-secondary-300 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200">
                <span className="text-secondary-700 font-bold text-sm">G</span>
              </button>
              <button className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-secondary-300 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200">
                <svg className="w-5 h-5 text-secondary-700" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
              <button className="w-12 h-12 bg-white/80 backdrop-blur-sm border border-secondary-300 rounded-full flex items-center justify-center hover:bg-white/90 transition-colors duration-200">
                <span className="text-secondary-700 font-bold text-sm">f</span>
              </button>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-secondary-500">
                Don't have an account yet?{' '}
                <Link href="/signup" className="text-primary-500 hover:text-primary-700 font-medium">
                  Register for free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Welcome Section with Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/image/login.png"
            alt="VMS Recruit Platform"
            fill
            className="object-cover"
            priority
            quality={95}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Dark Overlay for Better Text Readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-8 w-full h-full">
          {/* Top Right Logo */}
          <div className="absolute top-8 right-8">
            <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
          </div>

          {/* Welcome Text with Transparent Styling - positioned just below header */}
          <div className="max-w-md mt-20">
            <h1 className="text-3xl font-bold text-white/90 mb-2 drop-shadow-lg">Welcome to the</h1>
            <h2 className="text-3xl font-bold text-white/90 mb-6 drop-shadow-lg">VMS Recruit platform</h2>
            <p className="text-base text-white/80 drop-shadow-md">Find your dream job and advance your career</p>
          </div>
          
          {/* Empty divs for additional spacing below text */}
          <div className="max-w-md mt-8">
            <div className="w-full h-20 bg-transparent"></div>
          </div>
          <div className="max-w-md mt-4">
            <div className="w-full h-16 bg-transparent"></div>
          </div>
          <div className="max-w-md mt-4">
            <div className="w-full h-12 bg-transparent"></div>
          </div>
          <div className="max-w-md mt-4">
            <div className="w-full h-8 bg-transparent"></div>
          </div>
          <div className="max-w-md mt-4">
            <div className="w-full h-4 bg-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
