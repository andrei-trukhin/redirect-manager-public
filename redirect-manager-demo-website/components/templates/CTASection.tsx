import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

export function CTASection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="mx-auto max-w-4xl text-center">
        <Heading level="h2" align="center" className="mb-6 text-white">
          Ready to Get Started?
        </Heading>
        <Text size="lg" className="mb-8 text-indigo-100">
          Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
          magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem.
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="/contact" variant="primary" className="bg-white text-indigo-600 hover:bg-gray-50">
            Contact Us
          </Button>
          <Button href="/docs" variant="secondary" className="border-white text-white hover:bg-white hover:text-indigo-600">
            View Documentation
          </Button>
        </div>
      </div>
    </section>
  );
}
