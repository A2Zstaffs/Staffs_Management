import HeroSection from '@/components/homepage/HeroSection';
import JobCategories from '@/components/homepage/JobCategories';
// import FeaturedJobs from '@/components/homepage/FeaturedJobs';
import WhyChooseUs from '@/components/homepage/WhyChooseUs';
// import Testimonials from '@/components/homepage/Testimonials';
import CallToAction from '@/components/homepage/CallToAction';

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <JobCategories />
      {/* FeaturedJobs removed as requested */}
      <WhyChooseUs />
      {/* Testimonials removed as requested */}
      <CallToAction />
    </div>
  );
}
