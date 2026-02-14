import React, {useEffect, useMemo, useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Edit} from 'lucide-react';
import {RedirectsService} from '../../services/redirects.service';
import {Button} from '../atoms';
import FormField from '../molecules/FormField';
import Select from '../atoms/Select';
import Checkbox from '../atoms/Checkbox';
import LoadingState from '../molecules/LoadingState';
import ErrorState from '../molecules/ErrorState';
import { FormPageLayout } from '../templates';

const EditRedirect: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    statusCode: 301,
    domain: '',
    enabled: true,
  });

  // Fetch existing redirect data
  useEffect(() => {
    const fetchRedirect = async () => {
      if (!id) {
        setFetchError('No redirect ID provided');
        setFetchLoading(false);
        return;
      }

      try {
        setFetchLoading(true);
        const redirect = await RedirectsService.getRedirectById(id);
        
        setFormData({
          source: redirect.source || '',
          destination: redirect.destination || '',
          statusCode: redirect.statusCode || 301,
          domain: redirect.domain || '',
          enabled: redirect.enabled ?? true,
        });
        setFetchError(null);
      } catch (err) {
        setFetchError(err instanceof Error ? err.message : 'Failed to fetch redirect');
        console.error('Error fetching redirect:', err);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRedirect();
  }, [id]);

  // Validate required fields
  const isFormValid = useMemo(() => {
    return formData.source.trim() !== '' && formData.destination.trim() !== '';
  }, [formData.source, formData.destination]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === 'statusCode') {
      setFormData(prev => ({ ...prev, [name]: Number.parseInt(value, 10) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const calculateSourcePrefix = (source: string): string => {
    const parts = source.split('/');
    return parts[0] || '';
  };

  const handleSubmit = async () => {
    if (!id) {
      setError('No redirect ID provided');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const sourcePrefix = calculateSourcePrefix(formData.source);
      const sourceLength = formData.source.length;

      const payload: any = {
        source: formData.source,
        sourcePrefix,
        sourceLength,
        destination: formData.destination,
        statusCode: formData.statusCode,
        enabled: formData.enabled,
      };

      // Only include domain if it's not an empty string
      if (formData.domain && formData.domain.trim() !== '') {
        payload.domain = formData.domain;
      } else {
        payload.domain = null;
      }

      await RedirectsService.updateRedirect(id, payload);

      navigate(`/redirects/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update redirect');
      console.error('Error updating redirect:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while fetching
  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState message="Loading redirect..." />
      </div>
    );
  }

  // Show error state if fetch failed
  if (fetchError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <ErrorState
          message={fetchError}
          onRetry={() => globalThis.location.reload()}
        />
      </div>
    );
  }

  return (
    <FormPageLayout
      icon={Edit}
      title="Edit Redirect"
      description="Update the redirect configuration"
      backRoute={`/redirects/${id}`}
      backLabel="Back to Redirect"
      error={error}
      onErrorClose={() => setError(null)}
    >
      <form>
        <div className="space-y-6">
          <FormField
            name="source"
            label="Source URL"
            type="text"
            required
            value={formData.source}
            onChange={handleInputChange}
            placeholder="/old-page"
            helperText="The source path to redirect from"
          />

          <FormField
            name="destination"
            label="Destination URL"
            type="text"
            required
            value={formData.destination}
            onChange={handleInputChange}
            placeholder="/new-page"
            helperText="The destination path to redirect to"
          />

          <Select
            name="statusCode"
            label="HTTP Status Code"
            required
            value={formData.statusCode}
            onChange={handleInputChange}
            helperText="The HTTP status code for the redirect"
          >
            <option value={301}>301 - Moved Permanently</option>
            <option value={302}>302 - Found (Temporary)</option>
            <option value={304}>304 - Not Modified</option>
            <option value={307}>307 - Temporary Redirect</option>
            <option value={308}>308 - Permanent Redirect</option>
          </Select>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Settings</h3>

          <div className="space-y-6">
            <FormField
              name="domain"
              label="Domain"
              type="text"
              value={formData.domain}
              onChange={handleInputChange}
              placeholder="example.com"
              helperText="Enter the domain to redirect to an external site"
            />

            <Checkbox
              name="enabled"
              label="Enabled"
              checked={formData.enabled}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || !isFormValid}
            className="flex-1"
            onClick={handleSubmit}
          >
            {loading ? 'Updating...' : 'Update Redirect'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(`/redirects/${id}`)}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </FormPageLayout>
  );
};

export default EditRedirect;
