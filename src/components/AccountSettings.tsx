import { useEffect, useState } from 'react';
import { User, Mail, Lock, Trash2, Save } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { UsersService } from '@/generated-api/services/UsersService';
import type { UserResponse, UserUpdate } from '@/generated-api';

export default function AccountSettings() {
  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await UsersService.getUserProfileApiV1UserProfileGet();
        setProfile(data);
        setEmail(data.email ?? '');
      } catch (err) {
        console.error(err);
        toast.error('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    try {
      const update: UserUpdate = {
        email,
        ...(password ? { password } : {}), // only include password if set
      };
      const updated = await UsersService.updateCurrentUserProfileApiV1UserProfilePatch({
        requestBody: update,
      });
      setProfile(updated);
      toast.success('Account settings updated!');
      setPassword('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeactivate = () => {
    if (!profile) return;
    toast('Are you sure you want to deactivate your account?', {
      action: {
        label: 'Deactivate',
        onClick: async () => {
          try {
            await UsersService.deactivateUserApiV1UserUserIdDelete({
              userId: profile.id,
            });
            toast.success('Account deactivated');
            // TODO: maybe redirect or logout
          } catch (err) {
            console.error(err);
            toast.error('Failed to deactivate account.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {}, // required for Action type
      },
      duration: 10000,
    });
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading account settings…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
          <User className="h-5 w-5 text-blue-600" />
          Account Information
        </h2>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              <Mail className="mr-1 inline h-4 w-4" />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              <Lock className="mr-1 inline h-4 w-4" />
              New Password
            </label>
            <input
              type="password"
              value={password}
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            onClick={handleDeactivate}
            className="flex items-center gap-2 rounded-lg border border-red-300 px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Deactivate Account
          </button>
        </div>
      </div>

      <Toaster closeButton richColors expand position="top-center" />
    </div>
  );
}
