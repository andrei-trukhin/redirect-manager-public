import React from 'react';
import type { UserRole } from '../../services/users.service';

export interface UserRoleSelectProps {
  value: UserRole;
  onChange: (role: UserRole) => void;
  disabled?: boolean;
  label?: string;
  helperText?: string;
  error?: string;
}

const UserRoleSelect: React.FC<UserRoleSelectProps> = ({
  value,
  onChange,
  disabled = false,
  label = 'User Role',
  helperText,
  error,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as UserRole);
  };

  const baseClasses = 'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors bg-white';
  const normalClasses = 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  const errorClasses = 'border-red-500 focus:border-red-500 focus:ring-red-500';

  const selectClasses = `${baseClasses} ${error ? errorClasses : normalClasses}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={selectClasses}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
};

export default UserRoleSelect;

