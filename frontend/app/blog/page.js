import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
    title: 'Blog — A2Z Staffs | Recruitment Insights & Industry News',
    description: 'Stay updated with the latest recruitment trends, hiring tips, and industry insights from A2Z Staffs. Expert advice for employers and job seekers.',
    keywords: ['recruitment blog', 'hiring tips', 'staffing insights', 'job market trends', 'A2Z Staffs'],
    alternates: { canonical: 'https://a2zstaffs.com/blog' },
    openGraph: {
        title: 'Blog — A2Z Staffs | Recruitment Insights & Industry News',
        description: 'Stay updated with the latest recruitment trends, hiring tips, and industry insights from A2Z Staffs.',
        type: 'website',
        url: 'https://a2zstaffs.com/blog',
        images: [{ url: 'https://a2zstaffs.com/image/homepage.png', width: 1200, height: 630, alt: 'A2Z Staffs Blog' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog — A2Z Staffs | Recruitment Insights',
        description: 'Latest recruitment trends, hiring tips, and industry insights.',
        images: ['https://a2zstaffs.com/image/homepage.png'],
    },
};

const categories = [
    { name: 'Innovation', slug: 'innovation', description: 'Latest innovations in recruitment technology' },
    { name: 'Recruitment Tips', slug: 'recruitment-tips', description: 'Expert hiring strategies and best practices' },
    { name: 'Industry News', slug: 'industry-news', description: 'Stay updated with staffing industry trends' },
    { name: 'Career Advice', slug: 'career-advice', description: 'Tips for job seekers and career growth' },
];

const blogPosts = [
    {
        id: 1,
        title: 'How AI is Revolutionizing the Recruitment Industry',
        excerpt: 'Discover how artificial intelligence is transforming talent acquisition, from resume screening to candidate matching.',
        category: 'innovation',
        categoryName: 'Innovation',
        date: 'February 5, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'ai-revolutionizing-recruitment',
    },
    {
        id: 2,
        title: '10 Interview Questions Every Recruiter Should Ask',
        excerpt: 'Master the art of interviewing with these essential questions that reveal candidate potential and cultural fit.',
        category: 'recruitment-tips',
        categoryName: 'Recruitment Tips',
        date: 'February 3, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'essential-interview-questions',
    },
    {
        id: 3,
        title: 'The Future of Remote Hiring in 2026',
        excerpt: 'Explore the trends shaping remote recruitment and how companies are adapting their hiring strategies.',
        category: 'industry-news',
        categoryName: 'Industry News',
        date: 'February 1, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'future-of-remote-hiring',
    },
    {
        id: 4,
        title: 'Building a Strong Employer Brand to Attract Top Talent',
        excerpt: 'Learn how to create an employer brand that resonates with candidates and sets you apart from competitors.',
        category: 'recruitment-tips',
        categoryName: 'Recruitment Tips',
        date: 'January 28, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'building-employer-brand',
    },
    {
        id: 5,
        title: 'Smart Automation Tools for Efficient Recruitment',
        excerpt: 'Discover the latest tools that can automate repetitive tasks and streamline your hiring process.',
        category: 'innovation',
        categoryName: 'Innovation',
        date: 'January 25, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'smart-automation-recruitment',
    },
    {
        id: 6,
        title: 'How to Write Job Descriptions That Attract Quality Candidates',
        excerpt: 'Tips and templates for crafting compelling job descriptions that stand out and attract the right talent.',
        category: 'career-advice',
        categoryName: 'Career Advice',
        date: 'January 22, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'writing-job-descriptions',
    },
];

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            A2Z Staffs <span className="text-warm-400">Blog</span>
                        </h1>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                            Insights, tips, and trends from the world of recruitment and talent management.
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Navigation */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link
                            href="/blog"
                            className="px-6 py-2 rounded-full bg-primary-600 text-white font-medium hover:bg-primary-700 transition-colors"
                        >
                            All Posts
                        </Link>
                        {categories.map((category) => (
                            <Link
                                key={category.slug}
                                href={`/blog/category/${category.slug}`}
                                className="px-6 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors"
                            >
                                {category.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Article</h2>
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2 relative h-64 md:h-auto">
                                <Image
                                    src={blogPosts[0].image}
                                    alt={blogPosts[0].title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="md:w-1/2 p-8 flex flex-col justify-center">
                                <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-4 w-fit">
                                    {blogPosts[0].categoryName}
                                </span>
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                                    {blogPosts[0].title}
                                </h3>
                                <p className="text-gray-600 mb-6 text-lg">
                                    {blogPosts[0].excerpt}
                                </p>
                                <div className="flex items-center text-sm text-gray-500 mb-6">
                                    <span>{blogPosts[0].date}</span>
                                    <span className="mx-3">•</span>
                                    <span>{blogPosts[0].readTime}</span>
                                </div>
                                <Link
                                    href={`/blog/${blogPosts[0].slug}`}
                                    className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
                                >
                                    Read Article
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogPosts.slice(1).map((post) => (
                            <article key={post.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                <div className="relative h-48">
                                    <Image
                                        src={post.image}
                                        alt={post.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full mb-3">
                                        {post.categoryName}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between text-sm text-gray-500">
                                        <span>{post.date}</span>
                                        <span>{post.readTime}</span>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                    <p className="text-primary-100 text-lg mb-8">
                        Subscribe to our newsletter for the latest recruitment insights and industry news.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-6 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-warm-400"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-warm-500 text-white font-semibold rounded-lg hover:bg-warm-600 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
