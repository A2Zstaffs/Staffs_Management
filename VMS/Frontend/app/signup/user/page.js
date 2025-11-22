'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';

export default function CandidateSignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    countryCode: '+1',
    phoneNumber: '',
    location: '',
    skills: '',
    experience: '',
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData((prevData) => ({
        ...prevData,
        [name]: e.target.files[0],
      }));
    } else {
      // Format phone number to only allow digits
      if (name === 'phoneNumber') {
        const digitsOnly = value.replace(/\D/g, '').slice(0, 10);
        setFormData((prevData) => ({
          ...prevData,
          [name]: digitsOnly,
        }));
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }
    
    // Clear error when candidate starts typing
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm Password validation
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Phone Number validation
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    // Location validation
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    // Skills validation
    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = 'Please select your experience level';
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

    try {
      // Prepare user data for API
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        phoneNumber: `${formData.countryCode}${formData.phoneNumber.trim()}`,
        location: formData.location.trim(),
        skills: formData.skills.trim().split(',').map(skill => skill.trim()),
        experience: formData.experience,
        role: 'candidate'
      };

      // Call signup API
      const response = await authAPI.signup(userData);

      // Check if signup was successful
      console.log('Signup response:', response);
      if (response.success) {
        console.log('Signup successful, user data:', response.user || response.data);
        setSuccess(true);

        // Role-based redirect logic
        // Extract role and name from API response
        // Note: Backend returns 'user' field, but api.js may transform it to 'data'
        const userData = response.user || response.data;
        const userRole = userData?.role;
        const userName = userData?.fullName || formData.fullName.trim();
        
        // Also check the stored user data in case role/name is there
        const storedUser = authAPI.getCurrentUser();
        const finalRole = userRole || storedUser?.role;
        const finalName = userName || storedUser?.fullName || formData.fullName.trim();

        // Error handling: Check if role exists
        if (!finalRole) {
          console.error('API response missing role field');
          setErrors({ general: 'Signup successful but role information is missing. Please contact support.' });
          setIsLoading(false);
          return;
        }

        // Error handling: Check if name exists
        if (!finalName) {
          console.error('API response missing name field');
          setErrors({ general: 'Signup successful but name information is missing. Please contact support.' });
          setIsLoading(false);
          return;
        }

        // Save role and name in localStorage for easy access
        // This ensures the top navbar can display the user's name immediately
        if (typeof window !== 'undefined') {
          localStorage.setItem('userRole', finalRole);
          localStorage.setItem('userName', finalName);
        }

        // Redirect based on role - candidates go to candidate home page
        // No delay to avoid showing login page
        if (finalRole === 'candidate') {
          // Redirect candidate to candidate home page (TalentXO-style experience)
          router.push('/candidate/home');
        } else if (finalRole === 'recruiter') {
          // Keep existing recruiter flow - redirect to their dashboard
          router.push('/recruiter/dashboard');
        } else {
          // For other roles, redirect to general dashboard
          router.push('/dashboard');
        }
      } else {
        // Handle API error response
        setErrors({ general: response.message || 'Signup failed. Please try again.' });
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Signup error:', error);
      setErrors({ general: error.message || 'Signup failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden -mt-16 pt-16">
      {/* Left side - Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 overflow-y-auto">
        <div className="w-full max-w-xl">
          {/* Form Card - Glass Effect */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8 lg:p-10">
            {/* Role Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-accent-100 text-accent-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-accent-500 rounded-full mr-2"></div>
                Candidate Registration
              </div>
            </div>

            {/* Signup Heading */}
            <h1 className="text-3xl font-bold text-secondary-800 mb-8 text-center">Join as Candidate</h1>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Account created successfully! Redirecting to dashboard...
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 text-base ${
                      errors.fullName ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                  )}
                </div>

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
                    placeholder="candidate@gmail.com"
                    className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 text-base ${
                      errors.email ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-secondary-900 placeholder-gray-500 pr-10 text-base ${
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
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
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
                      className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-secondary-900 placeholder-gray-500 pr-10 text-base ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/50'
                      }`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
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
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary-700 mb-2">
                    Phone Number
                  </label>
                  <div className="flex gap-3 w-full">
                    <select
                      id="countryCode"
                      name="countryCode"
                      value={formData.countryCode}
                      onChange={handleChange}
                      className={`w-[80px] flex-shrink-0 px-2 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 text-sm ${
                        errors.phoneNumber ? 'border-red-500' : 'border-white/50'
                      }`}
                    >
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+91">🇮🇳 +91</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+55">🇧🇷 +55</option>
                    </select>
                    <div className="flex-1 relative min-w-0">
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="1234567890"
                        maxLength="10"
                        className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 text-base ${
                          errors.phoneNumber ? 'border-red-500' : 'border-white/50'
                        }`}
                        required
                      />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-secondary-500">Format: {formData.countryCode} XXXXXXXXXX (10 digits)</p>
                  {errors.phoneNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-secondary-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 placeholder-gray-500 text-base ${
                      errors.location ? 'border-red-500' : 'border-white/50'
                    }`}
                    required 
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="skills" className="block text-sm font-medium text-secondary-700 mb-2">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills}
                  onChange={handleChange}
                  placeholder="JavaScript, React, Node.js, Python..."
                  className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-secondary-900 placeholder-gray-500 text-base ${
                    errors.skills ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                />
                {errors.skills && (
                  <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-secondary-700 mb-2">
                    Years of Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-4 py-3.5 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-secondary-900 text-base ${
                      errors.experience ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-1">0-1 years (Entry Level)</option>
                    <option value="2-5">2-5 years (Mid Level)</option>
                    <option value="6-10">6-10 years (Senior Level)</option>
                    <option value="10+">10+ years (Expert Level)</option>
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-secondary-700 mb-2">
                    Upload Resume (Optional)
                  </label>
                  <input
                    type="file"
                    id="resume"
                    name="resume"
                    onChange={handleChange}
                    accept=".pdf,.doc,.docx"
                    className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 text-secondary-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-accent-50 file:text-accent-700 hover:file:bg-accent-100"
                  />
                </div>
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
                      Creating account...
                    </>
                  ) : (
                    'Register as Candidate'
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

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-secondary-500">
                Already have an account?{' '}
                <Link href="/login" className="text-primary-500 hover:text-primary-700 font-medium">
                  Sign in
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
            src="/image/user.png"
            alt="VMS Recruit Platform - Candidate"
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
