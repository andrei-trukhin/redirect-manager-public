import React, {useState} from 'react';
import type {CreateUserRequest, UserRole} from '../../services/users.service';
import {Button, Select} from '../atoms';
import {FormField} from "../molecules";

export interface UserCreateFormProps {
  onSubmit: (data: CreateUserRequest) => void;
  isLoading: boolean;
}

const UserCreateForm: React.FC<UserCreateFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<CreateUserRequest>({
    username: '',
    password: '',
    role: 'USER',
  });

  const handleSubmit = () => {
    if (formData.username.trim() && formData.password.trim()) {
      onSubmit(formData);
    }
  };

  return (
      <form className="space-y-6">
        <FormField
            name="username"
        label="Username"
        helperText="Enter a unique username for the new user."
        placeholder="e.g. john.doe"
        value={formData.username}
        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        required
      />

        <FormField
            name="password"
        label="Password"
        helperText="Choose a strong password for the user."
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        required
      />

      <Select
        label="Role"
        helperText="Select the user's access level."
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
        required
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </Select>

      <div className="flex justify-end gap-3">
          <Button onClick={handleSubmit} type="submit" variant="primary"
                  disabled={isLoading || !formData.username.trim() || !formData.password.trim()}>
          {isLoading ? 'Creating...' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserCreateForm;


