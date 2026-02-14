import { ContactHeroSection, ContactFormSection } from '@/components';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us - Redirect Manager Demo',
  description: 'Get in touch with our team for support, questions, or feedback about Redirect Manager. We are here to help with your redirect management needs.',
  keywords: 'contact, support, help, feedback, redirect manager',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <ContactHeroSection />
      <ContactFormSection />
    </div>
  );
}
