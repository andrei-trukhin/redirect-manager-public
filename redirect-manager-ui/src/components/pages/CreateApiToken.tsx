import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key } from 'lucide-react';
import { FormPageLayout } from '../templates';
import { TokenCreateForm } from '../organisms';
import { TokenDisplay } from '../molecules';
import { Button } from '../atoms';
import { TokensService, type CreateTokenRequest, type CreateTokenResponse } from '../../services/tokens.service';

const CreateApiToken: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdToken, setCreatedToken] = useState<CreateTokenResponse | null>(null);

  const handleSubmit = async (data: CreateTokenRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await TokensService.createToken(data);
      setCreatedToken(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormPageLayout
      icon={Key}
      title={createdToken ? 'Token Generated' : 'Create New API Token'}
      description={createdToken
        ? 'Your new API token has been created successfully.'
        : 'Generate a new token to interact with our API securely.'}
      backRoute="/tokens"
      backLabel="Back to Tokens"
      error={error}
      onErrorClose={() => setError(null)}
    >
      {createdToken ? (
        <div className="space-y-6">
          <TokenDisplay token={createdToken.token} />
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button variant="primary" onClick={() => navigate('/tokens')}>
              Done
            </Button>
          </div>
        </div>
      ) : (
        <TokenCreateForm onSubmit={handleSubmit} isLoading={isLoading} />
      )}
    </FormPageLayout>
  );
};

export default CreateApiToken;



