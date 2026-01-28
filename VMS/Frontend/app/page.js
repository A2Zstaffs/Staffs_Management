import HeroSection from '@/components/homepage/HeroSection';
// import TrustedCompanies from '@/components/homepage/TrustedCompanies';
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
      {/* <TrustedCompanies /> */}
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
