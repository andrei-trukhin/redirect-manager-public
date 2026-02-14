import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {
  ALargeSmall,
  ArrowRightFromLine,
  ArrowRightToLine,
  Calendar,
  Edit,
  Globe,
  Hash,
  LaptopMinimal,
  PowerIcon,
  Trash2
} from 'lucide-react';
import {
  ActionButton,
  ActionButtonGroup,
  Alert,
  Card,
  ConfirmDialog,
  ErrorState,
  FormHeader,
  LoadingState
} from '../molecules';
import MainLayout from '../templates/MainLayout';
import {type Redirect, RedirectsService} from '../../services/redirects.service';
import DetailField from "../molecules/DetailField.tsx";

const RedirectDetailView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [redirect, setRedirect] = useState<Redirect | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchRedirect = async () => {
      if (!id) {
        setError('Redirect ID is missing');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await RedirectsService.getRedirectById(id);
        setRedirect(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch redirect details');
        console.error('Error fetching redirect:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRedirect();
  }, [id]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleToggleEnabled = async () => {
    if (!id || !redirect) return;

    setIsToggling(true);
    setError(null);

    try {
      await RedirectsService.patchRedirect(id, {
        enabled: !redirect.enabled,
      });
      setRedirect({ ...redirect, enabled: !redirect.enabled});
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update redirect status');
      console.error('Error toggling redirect status:', err);
    } finally {
      setIsToggling(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    setError(null);

    try {
      await RedirectsService.deleteRedirect(id);
      navigate('/redirects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete redirect');
      console.error('Error deleting redirect:', err);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <LoadingState message="Loading redirect details..." />
        </div>
      </MainLayout>
    );
  }

  if (error || !redirect) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <ErrorState
            title="Error Loading Redirect"
            message={error || 'Redirect not found'}
            onRetry={() => navigate('/redirects')}
            retryLabel="Back to Redirects"
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <FormHeader
          icon={Globe}
          title="Redirect Details"
          description="View detailed information about this redirect"
          backRoute="/redirects"
          backLabel="Back to redirects"
        />

        <div className="mt-8">
          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Actions or Delete Confirmation */}
          {showDeleteConfirm ? (
            <ConfirmDialog
              title="Delete Redirect"
              message="Are you sure you want to delete this redirect? This action cannot be undone."
              confirmLabel="Confirm Delete"
              cancelLabel="Cancel"
              confirmIcon={<Trash2 className="w-4 h-4" />}
              variant="warning"
              isLoading={isDeleting}
              loadingLabel="Deleting..."
              onConfirm={handleDelete}
              onCancel={() => setShowDeleteConfirm(false)}
              className="mb-6"
            />
          ) : (
            <div className="flex gap-3 justify-end mb-6">
              <ActionButtonGroup
                  variant="ghost"
                onEnable={!redirect.enabled && !isToggling ? handleToggleEnabled : undefined}
                onDisable={redirect.enabled && !isToggling ? handleToggleEnabled : undefined}
                onDelete={() => setShowDeleteConfirm(true)}
              />
              <ActionButton
                onClick={() => navigate(`/redirects/${id}/edit`)}
                icon={Edit}
                label="Edit"
                variant="ghost-primary"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="space-y-6">
            {/* URL Information Card */}
            <Card title="Basic URL Information">
              <div className="space-y-6">
                <DetailField
                    icon={LaptopMinimal}
                    label="HTTP Status Code"
                    value={redirect.statusCode.toString()}
                />
                <DetailField
                    icon={ArrowRightToLine}
                    canCopy
                    label="Source URL"
                    value={redirect.source}
                />
                <DetailField
                    icon={ArrowRightFromLine}
                    canCopy
                    label="Destination URL"
                    value={redirect.destination}
                />
              </div>
            </Card>

            {/* Configuration Card */}
            <Card title="Configuration">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField
                    icon={Globe}
                    canCopy
                    label="Domain"
                    value={redirect.domain || undefined}
                    iconClassName={redirect.domain ? "text-blue-500" : ""}
                    hint={redirect.domain ? "External Redirect" : "Internal Redirect"}
                />
                <DetailField
                    label="Enabled"
                    value={redirect.enabled ? 'Yes' : 'No'}
                    icon={PowerIcon}
                    iconClassName={redirect.enabled ? "text-green-600" : ""}
                />
                <DetailField
                    icon={ALargeSmall}
                    label="Case Sensitive"
                    value={'No'}
                    hint="Not editable. All redirects are not case sensitive."
                />
              </div>
            </Card>

            {/* Basic Information Card */}
            <Card title="Basic Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField
                    icon={Hash}
                    canCopy
                    label="Redirect ID"
                    value={redirect.id.toString()}/>

              </div>
            </Card>

            {/* Metadata Card */}
            <Card title="Metadata">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailField
                    icon={Calendar}
                    label="Created At"
                    value={formatDate(redirect.createdAt)}
                />
                <DetailField
                    icon={Calendar}
                    label="Updated At"
                    value={formatDate(redirect.updatedAt)}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default RedirectDetailView;
