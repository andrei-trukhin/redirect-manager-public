import React from 'react';
import {Button, type ButtonProps} from "../atoms";
import {type LucideIcon} from "lucide-react";

export interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  icon: LucideIcon;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = (props) => {

  const {icon: Icon, className, label, ...rest} = props;

  return (
      <Button
          className={`flex items-center gap-1 ${className}`}
          {...rest}
      >
        <div className="flex items-center">
          <Icon className="w-4 h-4 mr-1"/>
          {label}
        </div>
      </Button>
  );
};

export default ActionButton;
