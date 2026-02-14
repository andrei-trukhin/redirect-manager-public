import { ReactNode } from 'react';

export interface TableProps {
  children: ReactNode;
  className?: string;
}

export interface TableHeaderProps {
  children: ReactNode;
  className?: string;
}

export interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export interface TableRowProps {
  children: ReactNode;
  className?: string;
}

export interface TableCellProps {
  children: ReactNode;
  isHeader?: boolean;
  className?: string;
}

export function Table({ children, className = '' }: Readonly<TableProps>) {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full bg-white border border-gray-200 rounded-lg ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TableHeader({ children, className = '' }: Readonly<TableHeaderProps>) {
  return (
    <thead className={`bg-gray-50 ${className}`}>
      {children}
    </thead>
  );
}

export function TableBody({ children, className = '' }: Readonly<TableBodyProps>) {
  return (
    <tbody className={`divide-y divide-gray-200 ${className}`}>
      {children}
    </tbody>
  );
}

export function TableRow({ children, className = '' }: Readonly<TableRowProps>) {
  return (
    <tr className={className}>
      {children}
    </tr>
  );
}

export function TableCell({ children, isHeader = false, className = '' }: Readonly<TableCellProps>) {
  const baseStyles = 'px-6 py-3 text-left';
  const headerStyles = 'text-xs font-semibold text-gray-700 uppercase tracking-wider border-b';
  const cellStyles = 'text-sm text-gray-900';

  const combinedClassName = `${baseStyles} ${isHeader ? headerStyles : cellStyles} ${className}`;

  if (isHeader) {
    return <th className={combinedClassName}>{children}</th>;
  }

  return <td className={combinedClassName}>{children}</td>;
}
