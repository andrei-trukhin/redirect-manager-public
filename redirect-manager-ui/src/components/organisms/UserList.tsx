import React from 'react';
import type {User} from '../../services/users.service';
import UserRow from '../molecules/UserRow';
import {EntitiesList} from '../molecules';
import {Users} from 'lucide-react';

export interface UserListProps {
  users: User[];
  onDelete: (id: string) => void;
  onUpdateRole: (user: User) => void;
  isLoading?: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, onDelete, onUpdateRole, isLoading }) => {
  return (
    <EntitiesList
      isLoading={isLoading}
      isEmpty={users.length === 0}
      emptyIcon={<Users className="w-12 h-12 text-gray-400" />}
      emptyMessage="No users found. There are no users in the system yet."
    >
      {users.map((user) => (
        <UserRow
          key={user.id}
          user={user}
          onDelete={onDelete}
          onUpdateRole={onUpdateRole}
        />
      ))}
    </EntitiesList>
  );
};

export default UserList;



