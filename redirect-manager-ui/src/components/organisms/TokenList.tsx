import React from 'react';
import { type ApiToken } from '../../services/tokens.service';
import { TokenRow, EntitiesList } from '../molecules';
import { Key } from 'lucide-react';

export interface TokenListProps {
  tokens: ApiToken[];
  onDelete: (id: string) => void;
  isLoading: boolean;
}

const TokenList: React.FC<TokenListProps> = ({ tokens, onDelete, isLoading }) => {
  return (
    <EntitiesList
      isLoading={isLoading}
      isEmpty={tokens.length === 0}
      emptyIcon={<Key className="w-12 h-12 text-gray-400" />}
      emptyMessage="You haven't created any API tokens yet. Create one to access the API programmatically."
    >
      {tokens.map((token) => (
        <TokenRow key={token.id} token={token} onDelete={onDelete} />
      ))}
    </EntitiesList>
  );
};

export default TokenList;



