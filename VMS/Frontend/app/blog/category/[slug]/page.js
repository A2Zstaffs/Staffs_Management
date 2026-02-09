import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';

const categories = {
    innovation: {
        name: 'Innovation',
        description: 'Discover the latest innovations in recruitment technology, AI-powered hiring solutions, and cutting-edge staffing strategies.',
    },
    'recruitment-tips': {
        name: 'Recruitment Tips',
        description: 'Expert hiring strategies, interview techniques, and best practices for building winning teams.',
    },
    'industry-news': {
        name: 'Industry News',
        description: 'Stay updated with the latest staffing industry trends, market insights, and workforce statistics.',
    },
    'career-advice': {
        name: 'Career Advice',
        description: 'Tips and guidance for job seekers looking to advance their careers and land their dream jobs.',
    },
};

const allBlogPosts = [
    {
        id: 1,
        title: 'How AI is Revolutionizing the Recruitment Industry',
        excerpt: 'Discover how artificial intelligence is transforming talent acquisition, from resume screening to candidate matching, making hiring faster and more accurate.',
        category: 'innovation',
        date: 'February 5, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'ai-revolutionizing-recruitment',
    },
    {
        id: 2,
        title: '10 Interview Questions Every Recruiter Should Ask',
        excerpt: 'Master the art of interviewing with these essential questions that reveal candidate potential, skills, and cultural fit.',
        category: 'recruitment-tips',
        date: 'February 3, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'essential-interview-questions',
    },
    {
        id: 3,
        title: 'The Future of Remote Hiring in 2026',
        excerpt: 'Explore the trends shaping remote recruitment and how companies are adapting their hiring strategies for a distributed workforce.',
        category: 'industry-news',
        date: 'February 1, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1587560699334-cc4ff634909a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'future-of-remote-hiring',
    },
    {
        id: 4,
        title: 'Building a Strong Employer Brand to Attract Top Talent',
        excerpt: 'Learn how to create an employer brand that resonates with candidates and sets you apart from competitors in the talent market.',
        category: 'recruitment-tips',
        date: 'January 28, 2026',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'building-employer-brand',
    },
    {
        id: 5,
        title: 'Smart Automation Tools for Efficient Recruitment',
        excerpt: 'Discover the latest tools that can automate repetitive tasks and streamline your hiring process without losing the human touch.',
        category: 'innovation',
        date: 'January 25, 2026',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'smart-automation-recruitment',
    },
    {
        id: 6,
        title: 'How to Write Job Descriptions That Attract Quality Candidates',
        excerpt: 'Tips and templates for crafting compelling job descriptions that stand out and attract the right talent to your organization.',
        category: 'career-advice',
        date: 'January 22, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'writing-job-descriptions',
    },
    {
        id: 7,
        title: 'Machine Learning in Candidate Screening: A Game Changer',
        excerpt: 'How machine learning algorithms are helping recruiters identify the best candidates faster and with greater accuracy.',
        category: 'innovation',
        date: 'January 20, 2026',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'machine-learning-candidate-screening',
    },
    {
        id: 8,
        title: 'Global Staffing Trends: What Companies Need to Know',
        excerpt: 'A comprehensive look at the staffing trends shaping the global workforce and how to prepare your company for the future.',
        category: 'industry-news',
        date: 'January 18, 2026',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        slug: 'global-staffing-trends',
    },
];

export async function generateStaticParams() {
    return Object.keys(categories).map((slug) => ({
        slug: slug,
    }));
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    const category = categories[slug];

    if (!category) {
        return {
            title: 'Category Not Found - A2Z Staffs Blog',
        };
    }

    return {
        title: `${category.name} - A2Z Staffs Blog | Recruitment Insights`,
        description: category.description,
        keywords: [`${category.name}`, 'recruitment', 'staffing', 'hiring', 'A2Z Staffs', 'blog'],
        openGraph: {
            title: `${category.name} - A2Z Staffs Blog`,
            description: category.description,
            type: 'website',
            url: `https://a2zstaffs.com/blog/category/${slug}`,
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const category = categories[slug];

    if (!category) {
        notFound();
    }

    const categoryPosts = allBlogPosts.filter(post => post.category === slug);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary-600 to-primary-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <nav className="mb-4">
                            <Link href="/blog" className="text-primary-200 hover:text-white transition-colors">
                                ← Back to Blog
                            </Link>
                        </nav>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                            {category.name}
                        </h1>
                        <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                            {category.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Categories Navigation */}
            <section className="py-6 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            href="/blog"
                            className="px-5 py-2 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors text-sm"
                        >
                            All Posts
                        </Link>
                        {Object.entries(categories).map(([catSlug, cat]) => (
                            <Link
                                key={catSlug}
                                href={`/blog/category/${catSlug}`}
                                className={`px-5 py-2 rounded-full font-medium transition-colors text-sm ${catSlug === slug
                                        ? 'bg-primary-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-primary-100 hover:text-primary-700'
                                    }`}
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Blog Posts Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {categoryPosts.length > 0 ? (
                        <>
                            <p className="text-gray-600 mb-8">{categoryPosts.length} article{categoryPosts.length !== 1 ? 's' : ''} in {category.name}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {categoryPosts.map((post) => (
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
                                                {category.name}
                                            </span>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                                                {post.title}
                                            </h3>
                                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
                        </>
                    ) : (
                        <div className="text-center py-16">
                            <h2 className="text-2xl font-bold text-gray-700 mb-4">No articles yet</h2>
                            <p className="text-gray-500 mb-8">Check back soon for new content in this category.</p>
                            <Link
                                href="/blog"
                                className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                            >
                                Browse All Articles
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                    <p className="text-primary-100 text-lg mb-8">
                        Subscribe to our newsletter for the latest {category.name.toLowerCase()} articles and updates.
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
