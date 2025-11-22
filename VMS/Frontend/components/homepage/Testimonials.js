'use client';

import { useState } from 'react';

export default function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Software Engineer',
      company: 'TechCorp Inc.',
      image: '👩‍💼',
      content: 'VMS Recruit helped me find my dream job in just 2 weeks! The platform is incredibly user-friendly and the matching algorithm is spot-on.',
      rating: 5
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Product Manager',
      company: 'StartupXYZ',
      image: '👨‍💼',
      content: 'As a recruiter, I\'ve found the best talent through VMS Recruit. The quality of candidates and the ease of the hiring process is unmatched.',
      rating: 5
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'UX Designer',
      company: 'DesignStudio',
      image: '👩‍🎨',
      content: 'The job recommendations were so accurate! I got multiple interview calls within days of signing up. Highly recommended!',
      rating: 5
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Data Scientist',
      company: 'DataFlow Systems',
      image: '👨‍🔬',
      content: 'VMS Recruit made my job search effortless. The interface is clean, and I found exactly what I was looking for.',
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Hear from job seekers and recruiters who found success with VMS Recruit
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 md:p-10">
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-accent-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial Content */}
              <blockquote className="text-lg text-secondary-700 mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center justify-center">
                <div className="text-3xl mr-4">{testimonials[currentTestimonial].image}</div>
                <div>
                  <div className="font-semibold text-secondary-900 text-base">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-sm text-secondary-600">
                    {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-center mt-8 space-x-2">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-secondary-100 hover:bg-primary-100 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                    index === currentTestimonial ? 'bg-primary-500' : 'bg-secondary-300'
                  }`}
                />
              ))}
              
              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-secondary-100 hover:bg-primary-100 text-secondary-600 hover:text-primary-600 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


