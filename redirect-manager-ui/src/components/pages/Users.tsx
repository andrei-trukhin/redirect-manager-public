import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Plus, Users as UsersIcon} from 'lucide-react';
import {MainLayout} from '../templates';
import {UserList} from '../organisms';
import {Button} from '../atoms';
import {type User, type UserRole, UsersService} from '../../services/users.service';
import {ConfirmDialog, ErrorState, UserRoleUpdateDialog, ListWrapper} from '../molecules';

const Users: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [userToUpdateRole, setUserToUpdateRole] = useState<User | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await UsersService.getUsers();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteClick = (id: string) => {
    globalThis.scroll({top: 0, behavior: 'smooth'});
    setUserToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await UsersService.deleteUser(userToDelete);
      setUsers(users.filter((u) => u.id !== userToDelete));
      setUserToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdateRoleClick = (user: User) => {
    setUserToUpdateRole(user);
  };

  const handleConfirmUpdateRole = async (userId: string, newRole: UserRole) => {
    const updatedUser = await UsersService.updateUserRole(userId, newRole);
    setUsers(users.map((u) => (u.id === userId ? updatedUser : u)));
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage system users and their access levels.
            </p>
          </div>
          <Button
            onClick={() => navigate('/users/create')}
            className="flex items-center gap-2 self-start sm:self-center"
          >
            <Plus className="w-5 h-5" />
            Create New User
          </Button>
        </div>

        {userToDelete && (
          <ConfirmDialog
            title="Delete User"
            message="Are you sure you want to delete this user? This action cannot be undone and the user will immediately lose access to the system."
            confirmLabel="Delete User"
            variant="error"
            isLoading={isDeleting}
            onConfirm={handleConfirmDelete}
            onCancel={() => setUserToDelete(null)}
          />
        )}

        {userToUpdateRole && (
            <UserRoleUpdateDialog
                user={userToUpdateRole}
                isOpen={!!userToUpdateRole}
                onClose={() => setUserToUpdateRole(null)}
                onConfirm={handleConfirmUpdateRole}
            />
        )}

        {error ? (
          <ErrorState
            title="Unable to load users"
            message={error}
            onRetry={fetchUsers}
          />
        ) : (
          <ListWrapper icon={UsersIcon} title="System Users">
            <UserList
              users={users}
              onDelete={handleDeleteClick}
              onUpdateRole={handleUpdateRoleClick}
              isLoading={isLoading}
            />
          </ListWrapper>
        )}
      </div>
    </MainLayout>
  );
};

export default Users;

