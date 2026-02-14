import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { FormPageLayout } from '../templates';
import { UserCreateForm } from '../organisms';
import { type CreateUserRequest, UsersService } from '../../services/users.service';

const CreateUser: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreateUserRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await UsersService.createUser(data);
      navigate('/users');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormPageLayout
      icon={UserPlus}
      title="Create New User"
      description="Add a new user to the system with specific access rights."
      backRoute="/users"
      backLabel="Back to Users"
      error={error}
      onErrorClose={() => setError(null)}
    >
      <UserCreateForm onSubmit={handleSubmit} isLoading={isLoading} />
    </FormPageLayout>
  );
};

export default CreateUser;


