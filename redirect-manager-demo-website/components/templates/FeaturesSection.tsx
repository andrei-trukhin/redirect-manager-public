import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { FeatureCard } from '../molecules/FeatureCard';

export function FeaturesSection() {
  const features = [
    {
      title: "Rapid Implementation",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum."
    },
    {
      title: "Scalable Architecture",
      description: "Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
    },
    {
      title: "Advanced Analytics",
      description: "Donec sed odio dui. Etiam porta sem malesuada magna mollis euismod. Nullam quis risus eget urna."
    },
    {
      title: "Secure Redirects",
      description: "Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis."
    },
    {
      title: "Real-time Monitoring",
      description: "Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa."
    },
    {
      title: "Easy Configuration",
      description: "Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl."
    }
  ];

  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Heading level="h2" align="center" className="mb-4">
            Powerful Features
          </Heading>
          <Text size="lg" className="mx-auto max-w-3xl">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium,
            totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={`feature-${feature.title}-${index}`}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
