import React from 'react';
import { type LucideIcon } from 'lucide-react';
import MainLayout from './MainLayout';
import { Alert, FormHeader } from '../molecules';

interface FormPageLayoutProps {
  icon: LucideIcon;
  title: string;
  description: string;
  backRoute: string;
  backLabel: string;
  error?: string | null;
  onErrorClose?: () => void;
  success?: string | null;
  onSuccessClose?: () => void;
  children: React.ReactNode;
}

const FormPageLayout: React.FC<FormPageLayoutProps> = ({
  icon,
  title,
  description,
  backRoute,
  backLabel,
  error,
  onErrorClose,
  success,
  onSuccessClose,
  children,
}) => {
  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto space-y-8">
        <FormHeader
          icon={icon}
          title={title}
          description={description}
          backRoute={backRoute}
          backLabel={backLabel}
        />

        {error && (
          <Alert
            variant="error"
            title="Error"
            onClose={onErrorClose}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            variant="success"
            title="Success"
            onClose={onSuccessClose}
          >
            {success}
          </Alert>
        )}

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {children}
        </div>
      </div>
    </MainLayout>
  );
};

export default FormPageLayout;
