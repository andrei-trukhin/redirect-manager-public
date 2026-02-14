import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';

export interface StepItemProps {
  number: number;
  title: string;
  description: string;
}

export function StepItem({ number, title, description }: StepItemProps) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
        {number}
      </div>
      <div className="flex-1">
        <Heading level="h3" className="mb-3">
          {title}
        </Heading>
        <Text>
          {description}
        </Text>
      </div>
    </div>
  );
}
