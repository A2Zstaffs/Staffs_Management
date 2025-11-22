'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ConsultancySignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    consultancyName: '',
    email: '',
    confirmEmail: '',
    primaryContact: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    consultancyType: '',
    experience: '',
    specialization: '',
    website: '',
    address: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
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

    // Consultancy Name validation
    if (!formData.consultancyName.trim()) {
      newErrors.consultancyName = 'Consultancy name is required';
    } else if (formData.consultancyName.trim().length < 2) {
      newErrors.consultancyName = 'Consultancy name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Confirm Email validation
    if (!formData.confirmEmail.trim()) {
      newErrors.confirmEmail = 'Please confirm your email address';
    } else if (formData.email !== formData.confirmEmail) {
      newErrors.confirmEmail = 'Email addresses do not match';
    }

    // Primary Contact validation
    if (!formData.primaryContact.trim()) {
      newErrors.primaryContact = 'Primary contact is required';
    } else if (formData.primaryContact.trim().length < 2) {
      newErrors.primaryContact = 'Primary contact must be at least 2 characters';
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
    }

    // Consultancy Type validation
    if (!formData.consultancyType) {
      newErrors.consultancyType = 'Please select consultancy type';
    }

    // Experience validation
    if (!formData.experience) {
      newErrors.experience = 'Please select years of experience';
    }

    // Specialization validation
    if (!formData.specialization) {
      newErrors.specialization = 'Please select specialization';
    }

    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    console.log('Validation errors:', newErrors);
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    console.log('Form is valid:', isValid);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    console.log('Form validation passed, proceeding with submission');
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual backend call later
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate data storage (replace with actual database storage later)
      const consultancyData = {
        id: Date.now().toString(),
        consultancyName: formData.consultancyName.trim(),
        email: formData.email.trim(),
        primaryContact: formData.primaryContact.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        consultancyType: formData.consultancyType,
        experience: formData.experience,
        specialization: formData.specialization,
        website: formData.website.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
        role: 'consultancy',
        createdAt: new Date().toISOString()
      };

      // Store consultancy data in localStorage for demo (replace with proper auth later)
      localStorage.setItem('user', JSON.stringify(consultancyData));
      localStorage.setItem('consultancies', JSON.stringify([
        ...(JSON.parse(localStorage.getItem('consultancies') || '[]')),
        consultancyData
      ]));

      console.log('Consultancy registration successful, redirecting to dashboard');
      setSuccess(true);
      
      // Show success message for 2 seconds then redirect
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setErrors({ general: 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden -mt-16 pt-16">
      {/* Left side - Form Card */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-to-br from-primary-50 to-primary-100 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Form Card - Glass Effect */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/30 p-8">
            {/* Role Badge */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Consultancy Registration
              </div>
            </div>

            {/* Signup Heading */}
            <h1 className="text-3xl font-bold text-secondary-800 mb-8 text-center">Partner with VMS Recruit</h1>
            <p className="text-sm text-secondary-600 mb-6 text-center">Grow your network and expand your consultancy business</p>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Consultancy registered successfully! Redirecting to dashboard...
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Consultancy Name - Featured prominently as in the image */}
              <div>
                <label htmlFor="consultancyName" className="block text-sm font-medium text-secondary-700 mb-2">
                  Consultancy Name
                </label>
                <input
                  type="text"
                  id="consultancyName"
                  name="consultancyName"
                  value={formData.consultancyName}
                  onChange={handleChange}
                  placeholder="Enter consultancy name"
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 ${
                    errors.consultancyName ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                />
                {errors.consultancyName && (
                  <p className="mt-1 text-sm text-red-600">{errors.consultancyName}</p>
                )}
              </div>

              {/* Email Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    placeholder="consultancy@example.com"
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 ${
                      errors.email ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmEmail" className="block text-sm font-medium text-secondary-700 mb-2">
                    Confirm Email
                  </label>
                  <input
                    type="email"
                    id="confirmEmail"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleChange}
                    placeholder="Confirm email"
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 ${
                      errors.confirmEmail ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  />
                  {errors.confirmEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmEmail}</p>
                  )}
                </div>
              </div>

              {/* Primary Contact - As featured in the image */}
              <div>
                <label htmlFor="primaryContact" className="block text-sm font-medium text-secondary-700 mb-2">
                  Primary Contact
                </label>
                <input
                  type="text"
                  id="primaryContact"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleChange}
                  placeholder="Enter primary contact name"
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 ${
                    errors.primaryContact ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                />
                {errors.primaryContact && (
                  <p className="mt-1 text-sm text-red-600">{errors.primaryContact}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 pr-10 ${
                        errors.password ? 'border-red-500' : 'border-white/50'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                      <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
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
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                      className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 pr-10 ${
                        errors.confirmPassword ? 'border-red-500' : 'border-white/50'
                      }`}
                      required
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                      <svg className="h-5 w-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-secondary-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 ${
                    errors.phoneNumber ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                )}
              </div>

              {/* Consultancy Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="consultancyType" className="block text-sm font-medium text-secondary-700 mb-2">
                    Consultancy Type
                  </label>
                  <select
                    id="consultancyType"
                    name="consultancyType"
                    value={formData.consultancyType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 ${
                      errors.consultancyType ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  >
                    <option value="">Select consultancy type</option>
                    <option value="management">Management Consulting</option>
                    <option value="technology">Technology Consulting</option>
                    <option value="hr">HR Consulting</option>
                    <option value="finance">Financial Consulting</option>
                    <option value="strategy">Strategy Consulting</option>
                    <option value="marketing">Marketing Consulting</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.consultancyType && (
                    <p className="mt-1 text-sm text-red-600">{errors.consultancyType}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-secondary-700 mb-2">
                    Years of Experience
                  </label>
                  <select
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 ${
                      errors.experience ? 'border-red-500' : 'border-white/50'
                    }`}
                    required
                  >
                    <option value="">Select experience</option>
                    <option value="0-2">0-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="11-15">11-15 years</option>
                    <option value="15+">15+ years</option>
                  </select>
                  {errors.experience && (
                    <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
                  )}
                </div>
              </div>

              {/* Specialization */}
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-secondary-700 mb-2">
                  Specialization
                </label>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 ${
                    errors.specialization ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="tech">Technology</option>
                  <option value="finance">Finance</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="education">Education</option>
                  <option value="retail">Retail</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="government">Government</option>
                  <option value="nonprofit">Non-profit</option>
                  <option value="other">Other</option>
                </select>
                {errors.specialization && (
                  <p className="mt-1 text-sm text-red-600">{errors.specialization}</p>
                )}
              </div>

              {/* Website */}
              <div>
                <label htmlFor="website" className="block text-sm font-medium text-secondary-700 mb-2">
                  Website (Optional)
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.consultancy.com"
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500"
                />
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-secondary-700 mb-2">
                  Business Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter business address"
                  rows={3}
                  className={`w-full px-4 py-3 bg-white/80 backdrop-blur-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 resize-none ${
                    errors.address ? 'border-red-500' : 'border-white/50'
                  }`}
                  required
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-2">
                  Business Description (Optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your consultancy services"
                  rows={3}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-secondary-900 placeholder-gray-500 resize-none"
                />
              </div>

              {/* Create Account Button - As shown in the image */}
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
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
                <Link href="/login" className="text-blue-500 hover:text-blue-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Welcome Section with Consultancy Image */}
      <div className="hidden lg:flex lg:w-1/2 relative">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/image/Consultancy.png"
            alt="VMS Recruit Platform - Consultancy Registration"
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
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">V</span>
            </div>
          </div>

          {/* Welcome Text with Transparent Styling - positioned just below header */}
          <div className="max-w-md mt-20">
            <h1 className="text-3xl font-bold text-white/90 mb-2 drop-shadow-lg">Welcome to the</h1>
            <h2 className="text-3xl font-bold text-white/90 mb-6 drop-shadow-lg">VMS Recruit platform</h2>
            <p className="text-base text-white/80 drop-shadow-md">Partner with us and grow your network</p>
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

