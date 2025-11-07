import React, { useState } from 'react';
import { Pencil1Icon, LockClosedIcon, ExitIcon } from '@radix-ui/react-icons';
import { useAuth } from '/imports/ui/contexts/AuthContext';
import { AuthMethods, AuthError } from '/imports/api/users';
import { 
  Button,
  Input,
  Label,
  Avatar,
  AvatarImage,
  AvatarFallback
} from '/imports/ui/components/ui';

interface UserProfileProps {
  onClose?: () => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const [profileData, setProfileData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    avatar: user?.profile?.avatar || '',
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!profileData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (profileData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters long';
    }

    if (!profileData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (profileData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters long';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await AuthMethods.updateProfile(profileData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      if (error instanceof AuthError) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Failed to update profile. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!passwordData.oldPassword) {
      newErrors.oldPassword = 'Current password is required';
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccess('');

    try {
      await AuthMethods.changePassword(passwordData.oldPassword, passwordData.newPassword);
      setSuccess('Password changed successfully!');
      setIsChangingPassword(false);
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error instanceof AuthError) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Failed to change password. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await AuthMethods.logout();
      onClose?.();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
        <Avatar className="w-16 h-16">
          <AvatarImage 
            src={user.profile?.avatar} 
            alt="Profile"
          />
          <AvatarFallback className="text-lg">
            {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{user.profile?.firstName} {user.profile?.lastName}</h3>
          <p className="text-sm text-gray-600">{user.emails?.[0]?.address}</p>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${
            user.profile?.status === 'online' ? 'bg-green-100 text-green-800' :
            user.profile?.status === 'away' ? 'bg-yellow-100 text-yellow-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            <span className={`w-2 h-2 rounded-full mr-1 ${
              user.profile?.status === 'online' ? 'bg-green-400' :
              user.profile?.status === 'away' ? 'bg-yellow-400' :
              'bg-gray-400'
            }`}></span>
            {user.profile?.status}
          </span>
        </div>
      </div>

      {success && (
        <div className="success-message mb-4">{success}</div>
      )}

      {errors.general && (
        <div className="mb-4 p-3 bg-danger-50 border border-danger-200 rounded-lg">
          <p className="text-danger-700 text-sm">{errors.general}</p>
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h4>
          
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
            <Input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              error={!!errors.firstName}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-danger-600 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
            <Input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              error={!!errors.lastName}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-danger-600 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar" className="text-gray-700">Avatar URL (optional)</Label>
            <Input
              type="url"
              id="avatar"
              name="avatar"
              value={profileData.avatar}
              onChange={handleProfileChange}
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2 w-4 h-4"></div>
                  Saving...
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : isChangingPassword ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
          
          <div className="space-y-2">
            <Label htmlFor="oldPassword" className="text-gray-700">Current Password</Label>
            <Input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              error={!!errors.oldPassword}
              disabled={isLoading}
            />
            {errors.oldPassword && (
              <p className="text-danger-600 text-sm mt-1">{errors.oldPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-gray-700">New Password</Label>
            <Input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={!!errors.newPassword}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="text-danger-600 text-sm mt-1">{errors.newPassword}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700">Confirm New Password</Label>
            <Input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={!!errors.confirmPassword}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-danger-600 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button 
              type="submit" 
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2 w-4 h-4"></div>
                  Changing...
                </div>
              ) : (
                'Change Password'
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              className="flex-1"
              onClick={() => setIsChangingPassword(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <Button 
            variant="outline"
            className="w-full justify-center"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <Pencil1Icon className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
          <Button 
            variant="outline"
            className="w-full justify-center"
            onClick={() => setIsChangingPassword(true)}
            disabled={isLoading}
          >
            <LockClosedIcon className="w-4 h-4 mr-2" />
            Change Password
          </Button>
          <Button 
            variant="destructive"
            className="w-full justify-center"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="spinner mr-2 w-4 h-4"></div>
                Signing Out...
              </div>
            ) : (
              <>
                <ExitIcon className="w-4 h-4 mr-2" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
