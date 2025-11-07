import { Meteor } from 'meteor/meteor';
import { DDPRateLimiter } from 'meteor/ddp-rate-limiter';

if (Meteor.isServer) {
  // Rate limiting rules for authentication methods
  const authMethods = [
    'users.register',
    'users.updateProfile',
    'users.updateStatus',
    'users.changePassword',
  ];

  // Rate limit authentication methods
  DDPRateLimiter.addRule({
    type: 'method',
    name(name) {
      return authMethods.includes(name);
    },
    connectionId() {
      return true;
    },
  }, 5, 60000); // 5 attempts per minute

  // Rate limit login attempts more strictly
  DDPRateLimiter.addRule({
    type: 'method',
    name: 'login',
    connectionId() {
      return true;
    },
  }, 3, 60000); // 3 login attempts per minute

  // Rate limit user creation
  DDPRateLimiter.addRule({
    type: 'method',
    name: 'users.register',
    connectionId() {
      return true;
    },
  }, 2, 300000); // 2 registrations per 5 minutes

  // Rate limit subscription attempts
  const subscriptionNames = [
    'userData',
    'onlineUsers',
    'allUsers',
  ];

  DDPRateLimiter.addRule({
    type: 'subscription',
    name(name) {
      return subscriptionNames.includes(name);
    },
    connectionId() {
      return true;
    },
  }, 10, 60000); // 10 subscription attempts per minute

  console.log('✅ Rate limiting configured for authentication methods');
}
