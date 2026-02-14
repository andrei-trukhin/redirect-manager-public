import React, {useState} from 'react';
import {type CreateTokenRequest, TokenScope} from '../../services/tokens.service';
import {Button, Select} from '../atoms';
import {FormField} from "../molecules";

export interface TokenCreateFormProps {
  onSubmit: (data: CreateTokenRequest) => void;
  isLoading: boolean;
}

const TokenCreateForm: React.FC<TokenCreateFormProps> = ({ onSubmit, isLoading }) => {
  const today = new Date().toISOString().split('T')[0];
  const oneYearFromNow = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0];

  const [formData, setFormData] = useState<CreateTokenRequest>({
    name: '',
    scope: TokenScope.READ,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const handleSubmit = () => {
    if (formData.name.trim()) {
      onSubmit({
        ...formData,
        expiresAt: new Date(formData.expiresAt).toISOString()
      });
    }
  };

  return (
      <form className="space-y-6">
          <FormField
              name="name"
        label="Token Name"
        helperText="Give your token a descriptive name to remember what it's for."
        placeholder="e.g. CI/CD Deployment"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Select
        label="Scope"
        helperText="Choose the level of access this token should have."
        value={formData.scope}
        onChange={(e) => setFormData({ ...formData, scope: e.target.value as TokenScope })}
        required
      >
        <option value={TokenScope.READ}>Read Only</option>
        <option value={TokenScope.READ_WRITE}>Read & Write</option>
      </Select>

          <FormField
              name="expiresAt"
        label="Expiration Date"
        helperText="Set when the token should expire (max 1 year)."
        type="date"
        min={today}
        max={oneYearFromNow}
        value={formData.expiresAt}
        onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
      />

      <div className="flex justify-end">
          <Button type="submit" onClick={handleSubmit} variant="primary" disabled={isLoading || !formData.name.trim()}>
          {isLoading ? 'Creating...' : 'Generate Token'}
        </Button>
      </div>
    </form>
  );
};

export default TokenCreateForm;
