import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { UseCaseCard } from '../molecules/UseCaseCard';

export function UseCasesSection() {
  const useCases = [
    {
      title: "E-commerce Platform",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris dignissim, nulla eu congue vulputate, purus lorem bibendum turpis, in cursus metus magna nec ante."
    },
    {
      title: "Content Migration",
      description: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula."
    },
    {
      title: "Marketing Campaigns",
      description: "Nulla facilisi morbi tempus iaculis urna id volutpat lacus laoreet non curabitur gravida arcu ac tortor dignissim convallis aenean et tortor."
    },
    {
      title: "API Versioning",
      description: "Proin eget tortor risus. Sed porttitor lectus nibh. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui."
    },
    {
      title: "Legacy System Support",
      description: "Curabitur non nulla sit amet nisl tempus convallis quis ac lectus. Donec rutrum congue leo eget malesuada."
    },
    {
      title: "Multi-domain Management",
      description: "Pellentesque in ipsum id orci porta dapibus. Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus."
    }
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <Heading level="h2" align="center" className="mb-4">
            Use Cases
          </Heading>
          <Text size="lg" className="mx-auto max-w-3xl">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
            deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <UseCaseCard
              key={`usecase-${useCase.title}-${index}`}
              title={useCase.title}
              description={useCase.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
