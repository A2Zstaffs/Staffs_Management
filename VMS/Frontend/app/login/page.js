"use client";
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authAPI } from '../../lib/api';

export default function LoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'recruiter' // Default role
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const response = await authAPI.login(formData);

            if (response.success) {
                // Redirect based on role
                const dashboardRoutes = {
                    admin: '/admin/dashboard',
                    recruiter: '/recruiter/dashboard',
                    candidate: '/candidate/dashboard',
                    client: '/client/dashboard',
                    consultancy: '/consultancy/dashboard' // Added consultancy route
                };

                const targetRoute = dashboardRoutes[formData.role] || '/';
                router.push(targetRoute);
            } else {
                setErrors({ general: response.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({
                general: error.message || 'An error occurred during login. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    };
    console.log("hey this is ajay")
    return (
        <div className="min-h-screen w-full animated-background-light flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Layer 1: Animated Background Blobs (Light Theme - Soft Blue/Violet) */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-blue-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
                <div className="absolute top-[10%] right-[10%] w-72 h-72 bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-[20%] left-[20%] w-72 h-72 bg-sky-200/40 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            {/* Container for Layer 2 & 3 */}
            <div className="relative z-10 w-full max-w-[400px]">
                {/* Layer 2: The Glow/Backdrop (Semi-transparent white halo) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-white/40 blur-2xl rounded-3xl -z-10"></div>

                {/* Layer 3: The Main Card (Milky Glass) */}
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 relative overflow-hidden">
                    {/* Top Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>

                    {/* Header - Compact */}
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800 mb-1 tracking-tight">Welcome Back</h1>
                        <p className="text-slate-500 text-xs">Sign in to your account</p>
                    </div>

                    {/* Error Message - Light Theme */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs flex items-center">
                            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {errors.general}
                        </div>
                    )}

                    {/* Login Form - Tight spacing */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label htmlFor="email" className="block text-xs font-medium text-slate-600 ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className={`w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 ${errors.email ? 'border-red-300 bg-red-50' : ''}`}
                                required
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500 ml-1">{errors.email}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="password" className="block text-xs font-medium text-slate-600 ml-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className={`w-full px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 ${errors.password ? 'border-red-300 bg-red-50' : ''}`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 ml-1">{errors.password}</p>
                            )}
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center text-sm"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </div>

                        <div className="flex justify-between items-center text-xs mt-4">
                            <Link href="#" className="text-blue-600/80 hover:text-blue-700 transition-colors">
                                Forgot Password?
                            </Link>
                            <Link href="/signup" className="text-blue-600/80 hover:text-blue-700 transition-colors">
                                Create Account
                            </Link>
                        </div>
                    </form>

                    {/* Role Selection - Refined & Compact */}
                    <div className="mt-5 pt-4 border-t border-slate-200/50">
                        <div className="relative group">
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full appearance-none bg-blue-50/50 hover:bg-blue-50 border border-slate-200 text-slate-600 text-xs font-semibold rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer text-center tracking-wide uppercase"
                            >
                                <option value="recruiter">Login as Recruiter</option>
                                <option value="candidate">Login as Candidate</option>
                                <option value="client">Login as Client</option>
                                <option value="consultancy">Login as Consultancy</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
