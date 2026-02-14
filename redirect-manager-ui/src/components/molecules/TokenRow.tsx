import React from 'react';
import {type ApiToken} from '../../services/tokens.service';
import {Hash, Key, ShieldCheck, Trash2} from 'lucide-react';
import EntityItem from "./EntityItem.tsx";
import DetailField from "./DetailField.tsx";
import {ActionButton} from "./index.ts";

export interface TokenRowProps {
    token: ApiToken;
    onDelete: (id: string) => void;
}

const TokenRow: React.FC<TokenRowProps> = ({token, onDelete}) => {
    const header = (
        <div className="grid grid-cols-1 md:grid-cols-[0.5fr_1fr_1fr] gap-4 w-full mb-4">
            <DetailField
                canCopy
                icon={Hash}
                label="ID"
                value={token.id}
            />
            <DetailField
                icon={Key}
                label="Token Name"
                value={token.name}
            />
            <DetailField
                icon={ShieldCheck}
                iconClassName={token.scope === 'READ_WRITE' ? 'text-blue-500' : undefined}
                label="Scope"
                value={token.scope.replace('_', ' ')}
            />
        </div>
    );

    const actions = (
        <div>
            <ActionButton
                variant="ghost-danger"
                onClick={() => onDelete(token.id)}
                className="flex items-center gap-2"
                title="Revoke Token"
                icon={Trash2}
                label="Delete"
            />
        </div>
    );

    return (
        <EntityItem
            createdAt={token.createdAt}
            lastUsedAt={token.lastUsedAt ?? undefined}
            header={header}
            actions={actions}
        />
    );
};

export default TokenRow;
