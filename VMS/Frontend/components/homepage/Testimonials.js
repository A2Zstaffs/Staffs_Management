'use client';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      content: 'A2Z Staffs helped me find my dream job in just 2 weeks! The platform is incredibly user-friendly and the matching algorithm is spot-on.',
      author: 'Rahul Sharma',
      role: 'Senior Developer',
      rating: 5,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 2,
      content: 'As a recruiter, I\'ve found the best talent through A2Z Staffs. The quality of candidates and the ease of the hiring process is unmatched.',
      author: 'Priya Patel',
      role: 'HR Manager, TechCorp',
      rating: 5,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 3,
      content: 'The dashboard provides excellent insights into our hiring pipeline. A2Z Staffs has transformed our recruitment process.',
      author: 'Amit Singh',
      role: 'Talent Acquisition Lead',
      rating: 4,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 4,
      content: 'A2Z Staffs made my job search effortless. The interface is clean, and I found exactly what I was looking for.',
      author: 'Sneha Gupta',
      role: 'UX Designer',
      rating: 5,
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of professionals and companies across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-shadow duration-300 border border-gray-100 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute top-8 right-8 text-gray-200 group-hover:text-gray-300 transition-colors">
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V11C14.017 11.5523 13.5693 12 13.017 12H12.017V5H22.017V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM5.0166 21L5.0166 18C5.0166 16.8954 5.91203 16 7.0166 16H10.0166C10.5689 16 11.0166 15.5523 11.0166 15V9C11.0166 8.44772 10.5689 8 10.0166 8H6.0166C5.46432 8 5.0166 8.44772 5.0166 9V11C5.0166 11.5523 4.56889 12 4.0166 12H3.0166V5H13.0166V15C13.0166 18.3137 10.3303 21 7.0166 21H5.0166Z" />
                </svg>
              </div>

              {/* Stars */}
              <div className="flex mb-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Content */}
              <p className="text-gray-600 text-lg leading-relaxed mb-8 relative z-10">
                "{testimonial.content}"
              </p>

              {/* Author Info */}
              <div className="flex items-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold mr-4 ${testimonial.color}`}>
                  {testimonial.author.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonial.author}
                  </h4>
                  <p className="text-sm text-gray-500 font-medium">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
