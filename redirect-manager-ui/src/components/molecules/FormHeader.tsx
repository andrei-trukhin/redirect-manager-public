import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { Button } from '../atoms';

export interface FormHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  backRoute: string;
  backLabel: string;
}

const FormHeader: React.FC<FormHeaderProps> = ({
  icon: Icon,
  title,
  description,
  backRoute,
  backLabel,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => navigate(backRoute)}
        className="mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        {backLabel}
      </Button>
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-600">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormHeader;

