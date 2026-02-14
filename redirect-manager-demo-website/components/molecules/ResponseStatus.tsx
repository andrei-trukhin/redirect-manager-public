import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { StatusCode } from '../atoms/StatusCode';
import { CodeBlock } from '../atoms/CodeBlock';

export interface ResponseStatusItem {
  code: number;
  description: string;
  example?: object | string;
}

export interface ResponseStatusProps {
  title?: string;
  description?: string;
  responses: ResponseStatusItem[];
  className?: string;
}

export function ResponseStatus({
  title = "Response Status Codes",
  description,
  responses,
  className = ''
}: Readonly<ResponseStatusProps>) {
  const formatExample = (example: object | string) => {
    if (typeof example === 'string') {
      return example;
    }
    return JSON.stringify(example, null, 2);
  };

  const getStatusLabel = (code: number): string => {
    const statusLabels: Record<number, string> = {
      200: 'OK',
      201: 'Created',
      400: 'Bad Request',
      401: 'Unauthorized',
      404: 'Not Found',
      409: 'Conflict',
      500: 'Internal Server Error'
    };
    return statusLabels[code] || 'Response';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header */}
      {title && (
        <Heading level="h3" className="mb-2">
          {title}
        </Heading>
      )}

      {description && (
        <Text size="base" className="mb-4">
          {description}
        </Text>
      )}

      {/* Response Status Items */}
      <div className="space-y-4">
        {responses.map((response) => (
          <div key={response.code} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-start gap-3 mb-3">
              <StatusCode code={response.code}>
                {getStatusLabel(response.code)}
              </StatusCode>
              <div className="flex-1">
                <Text size="base" className="text-gray-700 font-medium">
                  {response.description}
                </Text>
              </div>
            </div>

            {response.example && (
              <div className="mt-3">
                <Text size="sm" className="font-semibold mb-2 text-gray-700">
                  Example Response:
                </Text>
                <CodeBlock>
                  {formatExample(response.example)}
                </CodeBlock>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
