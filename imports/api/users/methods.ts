import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { check } from 'meteor/check';
import { 
  CreateUserData, 
  LoginData, 
  validateEmail, 
  validatePassword, 
  validateName 
} from './users';

// Custom error class for authentication
export class AuthError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Server-side methods
if (Meteor.isServer) {
  Meteor.methods({
    'users.register': async function(userData: CreateUserData) {
      check(userData, {
        email: String,
        password: String,
        firstName: String,
        lastName: String,
      });

      // Validation
      if (!validateEmail(userData.email)) {
        throw new AuthError('Invalid email format', 'INVALID_EMAIL');
      }

      if (!validatePassword(userData.password)) {
        throw new AuthError('Password must be at least 6 characters long', 'INVALID_PASSWORD');
      }

      if (!validateName(userData.firstName)) {
        throw new AuthError('First name must be at least 2 characters long', 'INVALID_FIRST_NAME');
      }

      if (!validateName(userData.lastName)) {
        throw new AuthError('Last name must be at least 2 characters long', 'INVALID_LAST_NAME');
      }

      // Check if user already exists
      const existingUser = await Accounts.findUserByEmail(userData.email);
      if (existingUser) {
        throw new AuthError('User with this email already exists', 'USER_EXISTS');
      }

      try {
        // Create user
        const userId = await Accounts.createUserAsync({
          email: userData.email,
          password: userData.password,
          profile: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            status: 'online',
            lastSeen: new Date(),
          },
        });

        // Send verification email
        if (userId) {
          Accounts.sendVerificationEmail(userId);
        }

        return { success: true, userId };
      } catch (error) {
        console.error('Registration error:', error);
        throw new AuthError('Failed to create user account', 'REGISTRATION_FAILED');
      }
    },

    'users.updateProfile': async function(profileData: Partial<{
      firstName: string;
      lastName: string;
      avatar: string;
    }>) {
      if (!this.userId) {
        throw new AuthError('Must be logged in to update profile', 'NOT_AUTHENTICATED');
      }

      check(profileData, {
        firstName: String,
        lastName: String,
        avatar: String,
      });

      // Validate names if provided
      if (profileData.firstName && !validateName(profileData.firstName)) {
        throw new AuthError('First name must be at least 2 characters long', 'INVALID_FIRST_NAME');
      }

      if (profileData.lastName && !validateName(profileData.lastName)) {
        throw new AuthError('Last name must be at least 2 characters long', 'INVALID_LAST_NAME');
      }

      try {
        await Meteor.users.updateAsync(this.userId, {
          $set: {
            'profile.firstName': profileData.firstName,
            'profile.lastName': profileData.lastName,
            'profile.avatar': profileData.avatar,
          },
        });

        return { success: true };
      } catch (error) {
        console.error('Profile update error:', error);
        throw new AuthError('Failed to update profile', 'UPDATE_FAILED');
      }
    },

    'users.updateStatus': async function(status: 'online' | 'offline' | 'away') {
      if (!this.userId) {
        throw new AuthError('Must be logged in to update status', 'NOT_AUTHENTICATED');
      }

      check(status, String);

      if (!['online', 'offline', 'away'].includes(status)) {
        throw new AuthError('Invalid status value', 'INVALID_STATUS');
      }

      try {
        await Meteor.users.updateAsync(this.userId, {
          $set: {
            'profile.status': status,
            'profile.lastSeen': new Date(),
          },
        });

        return { success: true };
      } catch (error) {
        console.error('Status update error:', error);
        throw new AuthError('Failed to update status', 'UPDATE_FAILED');
      }
    },

    'users.changePassword': async function(oldPassword: string, newPassword: string) {
      if (!this.userId) {
        throw new AuthError('Must be logged in to change password', 'NOT_AUTHENTICATED');
      }

      check(oldPassword, String);
      check(newPassword, String);

      if (!validatePassword(newPassword)) {
        throw new AuthError('New password must be at least 6 characters long', 'INVALID_PASSWORD');
      }

      try {
        await Accounts.changePasswordAsync(this.userId, oldPassword, newPassword);
        return { success: true };
      } catch (error) {
        console.error('Password change error:', error);
        throw new AuthError('Failed to change password. Please check your current password.', 'PASSWORD_CHANGE_FAILED');
      }
    },
  });
}

// Client-side helper functions
if (Meteor.isClient) {
  export const AuthMethods = {
    register: (userData: CreateUserData): Promise<{ success: boolean; userId?: string }> => {
      return new Promise((resolve, reject) => {
        Meteor.call('users.register', userData, (error: any, result: any) => {
          if (error) {
            reject(new AuthError(error.reason || 'Registration failed', error.error || 'UNKNOWN_ERROR'));
          } else {
            resolve(result);
          }
        });
      });
    },

    login: (loginData: LoginData): Promise<void> => {
      return new Promise((resolve, reject) => {
        Meteor.loginWithPassword(loginData.email, loginData.password, (error) => {
          if (error) {
            reject(new AuthError(error.reason || 'Login failed', error.error || 'LOGIN_FAILED'));
          } else {
            // Update status to online after successful login
            Meteor.call('users.updateStatus', 'online');
            resolve();
          }
        });
      });
    },

    logout: (): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Update status to offline before logout
        Meteor.call('users.updateStatus', 'offline', () => {
          Meteor.logout((error) => {
            if (error) {
              reject(new AuthError(error.reason || 'Logout failed', error.error || 'LOGOUT_FAILED'));
            } else {
              resolve();
            }
          });
        });
      });
    },

    updateProfile: (profileData: Partial<{
      firstName: string;
      lastName: string;
      avatar: string;
    }>): Promise<{ success: boolean }> => {
      return new Promise((resolve, reject) => {
        Meteor.call('users.updateProfile', profileData, (error: any, result: any) => {
          if (error) {
            reject(new AuthError(error.reason || 'Profile update failed', error.error || 'UPDATE_FAILED'));
          } else {
            resolve(result);
          }
        });
      });
    },

    changePassword: (oldPassword: string, newPassword: string): Promise<{ success: boolean }> => {
      return new Promise((resolve, reject) => {
        Meteor.call('users.changePassword', oldPassword, newPassword, (error: any, result: any) => {
          if (error) {
            reject(new AuthError(error.reason || 'Password change failed', error.error || 'PASSWORD_CHANGE_FAILED'));
          } else {
            resolve(result);
          }
        });
      });
    },
  };
}
