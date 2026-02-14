import React, {useState} from 'react';
import {Button} from '../atoms';
import {FormField} from "../molecules";

export interface PasswordChangeData {
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface PasswordChangeFormProps {
  onSubmit: (data: Omit<PasswordChangeData, 'confirmPassword'>) => void;
  isLoading: boolean;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<PasswordChangeData>({
    password: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof PasswordChangeData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof PasswordChangeData, string>> = {};

    if (!formData.password) {
      newErrors.password = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.password && formData.newPassword && formData.password === formData.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        password: formData.password,
        newPassword: formData.newPassword,
      });
    }
  };

  const handleInputChange = (field: keyof PasswordChangeData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [field]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
  };

  const isFormValid = formData.password && formData.newPassword && formData.confirmPassword;

  return (
    <form className="space-y-6">
      <FormField
          name="password"
        label="Current Password"
        type="password"
        placeholder="Enter your current password"
        value={formData.password}
        onChange={handleInputChange('password')}
        error={errors.password}
        required
        autoComplete="current-password"
      />

      <FormField
          name="newPassword"
          label="New Password"
        type="password"
        placeholder="Enter your new password"
        value={formData.newPassword}
        onChange={handleInputChange('newPassword')}
        error={errors.newPassword}
        helperText="Must be at least 8 characters long"
        required
        autoComplete="new-password"
      />

      <FormField
          name="confirmPassword"
        label="Confirm New Password"
        type="password"
        placeholder="Confirm your new password"
        value={formData.confirmPassword}
        onChange={handleInputChange('confirmPassword')}
        error={errors.confirmPassword}
        required
        autoComplete="new-password"
      />

      <div className="flex justify-end gap-3 pt-4">
        <Button
          onClick={handleSubmit}
          variant="primary"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? 'Changing Password...' : 'Change Password'}
        </Button>
      </div>
    </form>
  );
};

export default PasswordChangeForm;

