import React from 'react';
import Input, {type InputProps } from '../atoms/Input';

export interface FormFieldProps extends InputProps {
  name: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  required = false,
  ...props
}) => {
  const displayLabel = label ? (
    <>
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </>
  ) : undefined;

  return (
    <Input
      name={name}
      label={displayLabel as unknown as string}
      {...props}
    />
  );
};

export default FormField;
