import React, { type ReactNode } from 'react';
import { type LucideIcon } from 'lucide-react';

export interface ListWrapperProps {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  className?: string;
}

const ListWrapper: React.FC<ListWrapperProps> = ({
  icon: Icon,
  title,
  children,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Icon className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ListWrapper;

