import { Heading, Text, Button } from '@/components';

export function ContactHeroSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="mx-auto max-w-4xl text-center">
        <Heading level="h1" align="center" className="mb-4">
          Contact Us
        </Heading>
        <Text size="lg" className="mx-auto max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation.
        </Text>
      </div>
    </section>
  );
}

export function ContactFormSection() {
  return (
    <section className="py-16 px-6 bg-white">
      <div className="mx-auto max-w-2xl">
        <Heading level="h2" align="center" className="mb-8">
          Get In Touch
        </Heading>

        <div className="bg-gray-50 p-8 rounded-lg">
          <Text className="mb-6 text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>

          <div className="space-y-4">
            <div>
              <Text className="mb-2 font-semibold">
                Email Support
              </Text>
              <Text>
                support@redirectmanager.example.mock
              </Text>
            </div>

            <div>
              <Text className="mb-2 font-semibold">
                Business Hours
              </Text>
              <Text>
                Monday - Friday, XX:XX AM - XX:XX PM UTC
              </Text>
            </div>

            <div>
              <Text className="mb-2 font-semibold">
                Response Time
              </Text>
              <Text>
                Lorem ipsum dolor sit amet, typically within XX hours
              </Text>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Button href="mailto:support@redirectmanager.example.com" variant="primary">
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
