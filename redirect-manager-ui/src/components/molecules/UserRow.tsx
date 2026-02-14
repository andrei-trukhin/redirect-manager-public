import React from 'react';
import type {User} from '../../services/users.service';
import {Hash, ShieldCheck, Trash2, UserRound} from 'lucide-react';
import EntityItem from "./EntityItem.tsx";
import DetailField from "./DetailField.tsx";
import {ActionButton} from "./index.ts";

export interface UserRowProps {
  user: User;
  onDelete: (id: string) => void;
  onUpdateRole: (user: User) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onDelete, onUpdateRole }) => {

  const header = (
      <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr_1fr] gap-4 w-full mb-4">
          <DetailField
              canCopy
              icon={Hash}
              label="ID"
              value={user.id}
          />
        <DetailField
            canCopy
            icon={UserRound}
            label="Username"
            value={user.username}
        />
        <DetailField
            icon={ShieldCheck}
            iconClassName={user.role === 'ADMIN' ? 'text-blue-500' : undefined}
            label="Role"
            value={user.role}
        />
      </div>
  );

  const actions = (
      <div className="flex items-center gap-2">
          <ActionButton
              variant="ghost-primary"
            onClick={() => onUpdateRole(user)}
            title="Update role"
              icon={ShieldCheck}
              label="Update Role"
          />
          <ActionButton
              variant="ghost-danger"
            onClick={() => onDelete(user.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              icon={Trash2}
              label="Delete"
          />
      </div>
  );

  return (
      <EntityItem
          createdAt={user.createdAt}
          updatedAt={user.updatedAt}
          actions={actions}
          header={header}
      />
  );
};

export default UserRow;
