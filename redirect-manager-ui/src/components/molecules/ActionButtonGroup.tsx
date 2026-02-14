import React from 'react';
import {Power, PowerOff, Trash2} from 'lucide-react';
import ActionButton from './ActionButton';

export interface ActionButtonGroupProps {
  onEnable?: () => void;
  onDisable?: () => void;
  onDelete?: () => void;
  className?: string;
  variant?: 'ghost' | 'filled';
}

const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  onEnable,
  onDisable,
  onDelete,
                                                               variant = 'filled',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {onEnable && (
        <ActionButton
          onClick={onEnable}
          icon={Power}
          label="Enable"
          variant={variant === 'ghost' ? 'ghost-success' : 'primary'}
        />
      )}
      {onDisable && (
        <ActionButton
          onClick={onDisable}
          icon={PowerOff}
          label="Disable"
          variant={variant === 'ghost' ? 'ghost-secondary' : 'secondary'}
        />
      )}
      {onDelete && (
        <ActionButton
          onClick={onDelete}
          icon={Trash2}
          label="Delete"
          variant={variant === 'ghost' ? 'ghost-danger' : 'danger'}
        />
      )}
    </div>
  );
};

export default ActionButtonGroup;
