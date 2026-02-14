import { ReactNode } from 'react';

export interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className = '' }: Readonly<CodeBlockProps>) {
  return (
    <div className={`bg-gray-900 rounded-lg p-4 overflow-x-auto ${className}`}>
      <pre className="text-sm">
        <code className="text-gray-100 font-mono">
          {children}
        </code>
      </pre>
    </div>
  );
}
