import React, {useState} from 'react';
import {Modal} from '../organisms';
import {Badge, Button, UserRoleSelect} from '../atoms';
import type {User, UserRole} from '../../services/users.service';

export interface UserRoleUpdateDialogProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (userId: string, newRole: UserRole) => Promise<void>;
}

const UserRoleUpdateDialog: React.FC<UserRoleUpdateDialogProps> = ({
  user,
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(user.role);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (selectedRole === user.role) {
      onClose();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onConfirm(user.id, selectedRole);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user role');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setSelectedRole(user.role); // Reset to original role
      setError(null);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Update User Role"
      size="sm"
      footer={
        <>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading || selectedRole === user.role}
          >
            {isLoading ? 'Updating...' : 'Update Role'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Update the role for user <strong className="inline-block max-w-full truncate align-bottom"
                                             title={user.username}>{user.username}</strong>
          </p>

          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Current Role:</span>
              <Badge variant={user.role === 'ADMIN' ? 'success' : 'default'}>
                {user.role}
              </Badge>
            </div>
          </div>
        </div>

        <UserRoleSelect
          value={selectedRole}
          onChange={setSelectedRole}
          disabled={isLoading}
          label="New Role"
          helperText="Select the new role for this user"
          error={error || undefined}
        />

        {selectedRole !== user.role && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              {selectedRole === 'ADMIN'
                ? '⚠️ This user will gain administrative privileges and can manage all system resources.'
                : 'ℹ️ This user will have standard user privileges with limited access.'}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default UserRoleUpdateDialog;


