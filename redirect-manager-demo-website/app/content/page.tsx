import { ContentHeroSection, ContentListSection } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content - Redirect Manager Demo',
  description: 'Browse our comprehensive content library with guides, documentation, examples, and troubleshooting resources for Redirect Manager.',
  keywords: 'content, documentation, guides, examples, redirect manager',
};

export default function ContentPage() {
  return (
    <div className="min-h-screen">
      <ContentHeroSection />
      <ContentListSection />
    </div>
  );
}
