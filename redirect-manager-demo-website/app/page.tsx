import {
  HeroSection,
  FeaturesSection,
  UseCasesSection,
  AboutSection,
  CTASection
} from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redirect Manager Demo - Home',
  description: 'Explore the powerful features and capabilities of Redirect Manager through our interactive demo website with comprehensive examples and use cases.',
  keywords: 'redirect manager, demo, features, use cases, enterprise solution',
};

export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <AboutSection />
      <UseCasesSection />
      <CTASection />
    </div>
  );
}
