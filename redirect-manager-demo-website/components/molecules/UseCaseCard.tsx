import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export interface UseCaseCardProps {
  title: string;
  description: string;
}

export function UseCaseCard({ title, description }: UseCaseCardProps) {
  return (
    <div className="p-6 bg-gradient-to-br from-indigo-50 to-white rounded-xl border border-indigo-100 hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
      <Heading level="h3" className="mb-3">
        {title}
      </Heading>
      <Text>
        {description}
      </Text>
    </div>
  );
}
