import React, { useState } from 'react';
import { useAuth } from '/imports/ui/contexts/AuthContext';
import { AuthMethods, AuthError } from '/imports/api/users';

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
        <div className="w-16 h-16 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center text-white font-medium">
          {user.profile?.avatar ? (
            <img src={user.profile.avatar} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-lg">
              {user.profile?.firstName?.[0]}{user.profile?.lastName?.[0]}
            </span>
          )}
        </div>
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
          
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={profileData.firstName}
              onChange={handleProfileChange}
              className={`form-input ${errors.firstName ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="error-message">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={profileData.lastName}
              onChange={handleProfileChange}
              className={`form-input ${errors.lastName ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="error-message">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">Avatar URL (optional)</label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={profileData.avatar}
              onChange={handleProfileChange}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
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
            </button>
            <button 
              type="button" 
              className="btn btn-secondary flex-1"
              onClick={() => setIsEditing(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : isChangingPassword ? (
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900 mb-4">Change Password</h4>
          
          <div>
            <label htmlFor="oldPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={passwordData.oldPassword}
              onChange={handlePasswordChange}
              className={`form-input ${errors.oldPassword ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.oldPassword && (
              <p className="error-message">{errors.oldPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className={`form-input ${errors.newPassword ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.newPassword && (
              <p className="error-message">{errors.newPassword}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
            )}
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              type="submit" 
              className="btn btn-primary flex-1"
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
            </button>
            <button 
              type="button" 
              className="btn btn-secondary flex-1"
              onClick={() => setIsChangingPassword(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-3">
          <button 
            className="btn btn-secondary w-full justify-center"
            onClick={() => setIsEditing(true)}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
          <button 
            className="btn btn-secondary w-full justify-center"
            onClick={() => setIsChangingPassword(true)}
            disabled={isLoading}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v-2L4.257 10.257a6 6 0 0110.486-10.486L15 7z" />
            </svg>
            Change Password
          </button>
          <button 
            className="btn btn-danger w-full justify-center"
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
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sign Out
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
