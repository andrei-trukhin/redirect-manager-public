import React from 'react';
import { Plus } from 'lucide-react';
import Button from './Button';

interface CreateNewButtonProps {
  onClick: () => void;
  className?: string;
}

const CreateNewButton: React.FC<CreateNewButtonProps> = ({ onClick, className = '' }) => {
  return (
    <Button
      variant="primary"
      onClick={onClick}
      className={`flex items-center gap-2 ${className}`}
    >
      <Plus className="w-5 h-5" />
      Create New
    </Button>
  );
};

export default CreateNewButton;


