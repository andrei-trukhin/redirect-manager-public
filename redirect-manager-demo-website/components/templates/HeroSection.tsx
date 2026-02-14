import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Button } from '../atoms/Button';

export function HeroSection() {
  return (
    <section className="relative py-20 px-6 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <Heading level="h1" align="center" className="mb-6">
            Redirect Manager Demo
          </Heading>
          <Text size="xl" className="mb-8 mx-auto max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
          </Text>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="#features" variant="primary">
              Explore Features
            </Button>
            <Button href="/docs" variant="secondary">
              Documentation
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-indigo-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-purple-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-blue-200 rounded-full opacity-20 animate-pulse delay-500"></div>
      </div>
    </section>
  );
}
