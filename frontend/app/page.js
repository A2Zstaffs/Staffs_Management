export const metadata = {
  title: 'A2Z Staffs — Professional Recruitment & Staffing Solutions in India',
  description: 'A2Z Staffs connects top talent with leading companies across India. Find jobs, hire candidates, and manage your recruitment pipeline — all in one platform.',
  keywords: ['recruitment platform India', 'find jobs India', 'hire candidates', 'staffing solutions', 'job portal', 'talent acquisition', 'A2Z Staffs'],
  alternates: { canonical: 'https://a2zstaffs.com' },
  openGraph: {
    title: 'A2Z Staffs — Professional Recruitment & Staffing Solutions',
    description: 'Connect top talent with leading companies. Find jobs, hire candidates, and manage recruitment — all in one platform.',
    url: 'https://a2zstaffs.com',
    type: 'website',
    images: [{ url: 'https://a2zstaffs.com/image/homepage.png', width: 1200, height: 630, alt: 'A2Z Staffs Platform' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A2Z Staffs — Recruitment & Staffing Solutions',
    description: 'Connect top talent with leading companies across India.',
    images: ['https://a2zstaffs.com/image/homepage.png'],
  },
};

import HeroSection from '@/components/homepage/HeroSection';
import TrustedCompanies from '@/components/homepage/TrustedCompanies';
import StatsSection from '@/components/homepage/StatsSection';
import JobCategories from '@/components/homepage/JobCategories';
import FeaturedJobs from '@/components/homepage/FeaturedJobs';
import HowItWorks from '@/components/homepage/HowItWorks';
import WhyChooseUs from '@/components/homepage/WhyChooseUs';
import Testimonials from '@/components/homepage/Testimonials';
import FAQSection from '@/components/homepage/FAQSection';
import CallToAction from '@/components/homepage/CallToAction';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustedCompanies />
      <StatsSection />
      <JobCategories />
      <HowItWorks />
      <FeaturedJobs />
      <WhyChooseUs />
      <Testimonials />
      <FAQSection />
      <CallToAction />
    </div>
  );
}
