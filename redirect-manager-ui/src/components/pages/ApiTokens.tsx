import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Plus, Shield} from 'lucide-react';
import {MainLayout} from '../templates';
import {TokenList} from '../organisms';
import {Button} from '../atoms';
import {type ApiToken, TokensService} from '../../services/tokens.service';
import {ConfirmDialog, ErrorState, ListWrapper} from '../molecules';

const ApiTokens: React.FC = () => {
    const navigate = useNavigate();
    const [tokens, setTokens] = useState<ApiToken[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tokenToDelete, setTokenToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchTokens = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await TokensService.getTokens();
            setTokens(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tokens');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTokens();
    }, []);

    const handleDeleteClick = (id: string) => {
        globalThis.scroll({top: 0, behavior: 'smooth'});
        setTokenToDelete(id);
    };

    const handleConfirmDelete = async () => {
        if (!tokenToDelete) return;

        setIsDeleting(true);
        try {
            await TokensService.deleteToken(tokenToDelete);
            setTokens(tokens.filter((t) => t.id !== tokenToDelete));
            setTokenToDelete(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete token');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <MainLayout>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">API Tokens</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage personal access tokens to access the Redirect Manager API.
                        </p>
                    </div>
                    <Button
                        onClick={() => navigate('/tokens/create')}
                        className="flex items-center gap-2 self-start sm:self-center"
                    >
                        <Plus className="w-5 h-5"/>
                        Create New Token
                    </Button>
                </div>

                {tokenToDelete && (
                    <ConfirmDialog
                        title="Revoke API Token"
                        message="Are you sure you want to revoke this token? Any applications or scripts using it will immediately lose access to the API. This action cannot be undone."
                        confirmLabel="Revoke Token"
                        variant="error"
                        isLoading={isDeleting}
                        onConfirm={handleConfirmDelete}
                        onCancel={() => setTokenToDelete(null)}
                    />
                )}

                {error ? (
                    <ErrorState
                        title="Unable to load tokens"
                        message={error}
                        onRetry={fetchTokens}
                    />
                ) : (
                    <ListWrapper icon={Shield} title="Active Tokens">
                        <TokenList
                            tokens={tokens}
                            onDelete={handleDeleteClick}
                            isLoading={isLoading}
                        />
                    </ListWrapper>
                )}
            </div>

        </MainLayout>
    );
};

export default ApiTokens;
