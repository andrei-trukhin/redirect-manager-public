import { Heading, Text, Button } from '@/components';

export function ContentHeroSection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="mx-auto max-w-4xl text-center">
        <Heading level="h1" align="center" className="mb-4">
          Content Library
        </Heading>
        <Text size="lg" className="mx-auto max-w-2xl">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </div>
    </section>
  );
}

export function ContentListSection() {
  const contentItems = [
    {
      title: "Getting Started Guide",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dignissim, nulla eu congue vulputate."
    },
    {
      title: "API Documentation",
      description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {
      title: "Configuration Examples",
      description: "Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam quis risus eget urna."
    },
    {
      title: "Troubleshooting",
      description: "Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis."
    }
  ];

  return (
    <section className="py-16 px-6 bg-white">
      <div className="mx-auto max-w-4xl">
        <Heading level="h2" className="mb-8">
          Available Content
        </Heading>
        <div className="grid gap-6">
          {contentItems.map((item, index) => (
            <div key={`content-${item.title}-${index}`} className="p-6 bg-gray-50 rounded-lg border border-gray-200">
              <Heading level="h3" className="mb-3">
                {item.title}
              </Heading>
              <Text className="mb-4">
                {item.description}
              </Text>
              <Button href="/docs" variant="primary">
                Read More
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
