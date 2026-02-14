import { ReactNode } from 'react';
import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Badge, BadgeVariant } from '../atoms/Badge';

export interface EndpointCardProps {
  method: BadgeVariant;
  path: string;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
}

export function EndpointCard({
  method,
  path,
  title,
  description,
  children,
  className = ''
}: Readonly<EndpointCardProps>) {
  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* Header with a gray background */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 rounded-t-lg">
        <div className="flex items-center gap-3">
          <Badge variant={method}>
            {method}
          </Badge>
          <Text size="base" color="primary" className="font-mono">
            {path}
          </Text>
        </div>
        {title && (
          <Heading level="h3" className="mt-2 mb-0">
            {title}
          </Heading>
        )}
      </div>

      {/* Content area */}
      <div className="p-6">
        {description && (
          <Text size="base" className="mb-4">
            {description}
          </Text>
        )}
        {children}
      </div>
    </div>
  );
}
