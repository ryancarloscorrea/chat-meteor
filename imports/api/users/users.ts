import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'; 

// User profile interface
export interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen: Date;
}

// Extended user interface
export interface User extends Meteor.User {
  profile: UserProfile;
  emails: Array<{
    address: string;
    verified: boolean;
  }>;
}

// User creation interface
export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Login interface
export interface LoginData {
  email: string;
  password: string;
}

// Configure accounts
Accounts.config({
  sendVerificationEmail: true,
  forbidClientAccountCreation: false,
  loginExpiration: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
} as any);

// Set default profile fields
Accounts.onCreateUser((options: any, user: any) => {
  const profile: UserProfile = {
    firstName: options.profile?.firstName || '',
    lastName: options.profile?.lastName || '',
    avatar: options.profile?.avatar || '',
    status: 'online',
    lastSeen: new Date(),
  };

  return {
    ...user,
    profile,
  };
});

// Validation rules
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export { validateEmail, validatePassword, validateName };
