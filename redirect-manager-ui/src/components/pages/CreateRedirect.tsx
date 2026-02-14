import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { RedirectsService } from '../../services/redirects.service';
import { Button } from '../atoms';
import FormField from '../molecules/FormField';
import Select from '../atoms/Select';
import Checkbox from '../atoms/Checkbox';
import { FormPageLayout } from '../templates';

const CreateRedirect: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    statusCode: 301,
    domain: '',
    enabled: true,
  });

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
      }

      await RedirectsService.createRedirect(payload);

      navigate('/redirects');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create redirect');
      console.error('Error creating redirect:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormPageLayout
      icon={PlusCircle}
      title="Create New Redirect"
      description="Add a new URL redirect with custom HTTP status code"
      backRoute="/redirects"
      backLabel="Back to Redirects"
      error={error}
      onErrorClose={() => setError(null)}
    >
      <form>
        {/* Required Fields */}
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

        {/* Optional Fields */}
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

        {/* Action Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            type="button"
            variant="primary"
            onClick={handleSubmit}
            disabled={loading || !isFormValid}
            className="flex-1"
          >
            {loading ? 'Creating...' : 'Create Redirect'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/redirects')}
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

export default CreateRedirect;
