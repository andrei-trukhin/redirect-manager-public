import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {User} from 'lucide-react';
import {FormPageLayout} from '../templates';
import {PasswordChangeForm} from '../organisms';
import {UsersService} from '../../services/users.service';
import {AuthService} from '../../services/auth.service';
import {ActionButton, Card} from "../molecules";

const Account: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: { password: string; newPassword: string }) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await UsersService.changePassword(data.password, data.newPassword);
      setSuccess('Password changed successfully! You will be redirected to login...');

      // Auto-redirect after successful password change
      setTimeout(async () => {
        await AuthService.logout();
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormPageLayout
      icon={User}
      title="Account Settings"
      description="Manage your account settings and change your password."
      backRoute="/redirects"
      backLabel="Back to Dashboard"
      error={error}
      onErrorClose={() => setError(null)}
      success={success}
      onSuccessClose={() => setSuccess(null)}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
        <p className="mt-1 text-sm text-gray-600">
          Update your password to keep your account secure.
        </p>
      </div>
      <PasswordChangeForm onSubmit={handleSubmit} isLoading={isLoading} />

      <Card
          className="mt-10 content-end"
          title="Logout from all devices"
          subtitle="This will log you out from all active sessions on other devices. You will need to log in again on those devices."
      >
        <ActionButton
            variant="ghost-danger"
            onClick={() => {
              AuthService.logout({ allDevices: true }).then(() => navigate('/login'));
            }}
            className="mt-6"
            label="Logout from all devices"
            icon={User}
        />
      </Card>

    </FormPageLayout>
  );
};

export default Account;

