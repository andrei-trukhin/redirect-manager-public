import { Heading } from '../atoms/Heading';
import { Text } from '../atoms/Text';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '../atoms/Table';
import { CodeBlock } from '../atoms/CodeBlock';

export interface BodyParameter {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
  example?: string;
}

export interface BodyObjectProps {
  id?: string;
  title?: string;
  description?: string;
  parameters: BodyParameter[];
  example?: object | string;
  className?: string;
}

export function BodyObject({
  id,
  title = "Request Body",
  description,
  parameters,
  example,
  className = ''
}: Readonly<BodyObjectProps>) {
  const formatExample = (example: object | string) => {
    if (typeof example === 'string') {
      return example;
    }
    return JSON.stringify(example, null, 2);
  };

  return (
    <div id={id} className={`space-y-4 ${className}`}>
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

      {/* Parameters Table */}
      <div>
        <Text size="sm" className="font-semibold mb-3 text-gray-700">
          Parameters:
        </Text>
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell isHeader>Parameter</TableCell>
              <TableCell isHeader>Type</TableCell>
              <TableCell isHeader>Required</TableCell>
              <TableCell isHeader>Description</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {parameters.map((param) => (
              <TableRow key={param.name}>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                    {param.name}
                  </code>
                </TableCell>
                <TableCell>
                  <span className="text-blue-600 font-medium">
                    {param.type}
                  </span>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                    param.required 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {param.required ? 'Required' : 'Optional'}
                  </span>
                </TableCell>
                <TableCell>
                  <Text size="sm" className="text-gray-600">
                    {param.description || 'No description provided'}
                  </Text>
                  {param.example && (
                    <div className="mt-1">
                      <Text size="sm" className="text-gray-500">
                        Example: <code className="bg-gray-100 px-1 py-0.5 rounded text-xs">{param.example}</code>
                      </Text>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Example JSON */}
      {example && (
        <div>
          <Text size="sm" className="font-semibold mb-3 text-gray-700">
            Example:
          </Text>
          <CodeBlock>
            {formatExample(example)}
          </CodeBlock>
        </div>
      )}
    </div>
  );
}
