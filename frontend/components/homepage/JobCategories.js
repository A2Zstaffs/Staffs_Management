'use client';

import { useRouter } from 'next/navigation';
import {
  Code,
  TrendingUp,
  CircleDollarSign,
  GraduationCap,
  Stethoscope,
  Palette,
  Phone,
  Wrench
} from 'lucide-react';

export default function JobCategories() {
  const router = useRouter();

  const categories = [
    { id: 1, name: 'IT & Software', icon: <Code className="w-8 h-8" />, color: 'bg-primary-100 text-primary-600' },
    { id: 2, name: 'Marketing', icon: <TrendingUp className="w-8 h-8" />, color: 'bg-accent-100 text-accent-600' },
    { id: 3, name: 'Finance', icon: <CircleDollarSign className="w-8 h-8" />, color: 'bg-warm-100 text-warm-600' },
    { id: 4, name: 'Education', icon: <GraduationCap className="w-8 h-8" />, color: 'bg-primary-200 text-primary-700' },
    { id: 5, name: 'Healthcare', icon: <Stethoscope className="w-8 h-8" />, color: 'bg-accent-200 text-accent-700' },
    { id: 6, name: 'Design', icon: <Palette className="w-8 h-8" />, color: 'bg-primary-300 text-primary-800' },
    { id: 7, name: 'Sales', icon: <Phone className="w-8 h-8" />, color: 'bg-indigo-100 text-indigo-600' },
    { id: 8, name: 'Others', icon: <Wrench className="w-8 h-8" />, color: 'bg-secondary-100 text-secondary-600' }
  ];

  // Duplicate for seamless infinite scroll
  const marqueeCategories = [...categories, ...categories];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">Browse Jobs by Category</h2>
          <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
            Find opportunities in your field of expertise
          </p>
        </div>
      </div>

      {/* Scrolling marquee — full width */}
      <div className="relative overflow-hidden w-full">
        {/* Gradient masks */}
        <div className="absolute top-0 left-0 z-10 h-full w-24 bg-gradient-to-r from-white to-transparent pointer-events-none" />
        <div className="absolute top-0 right-0 z-10 h-full w-24 bg-gradient-to-l from-white to-transparent pointer-events-none" />

        <div className="flex w-max animate-scroll pause-on-hover">
          {marqueeCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => router.push(`/candidate/explore-jobs?category=${encodeURIComponent(category.name)}`)}
              className="mx-4 cursor-pointer group relative bg-white/80 backdrop-blur-sm rounded-2xl border border-secondary-100/60 p-6 w-44 flex-shrink-0 transition-all duration-300 ease-out hover:scale-[1.06] hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="text-center">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color.split(' ')[0]}`}>
                  <span className={category.color.split(' ')[1]}>{category.icon}</span>
                </div>
                <h3 className="text-sm font-semibold text-secondary-900 mb-3 group-hover:text-primary-600 transition-colors duration-200">
                  {category.name}
                </h3>
                <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${category.color}`}>
                  View Jobs
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
