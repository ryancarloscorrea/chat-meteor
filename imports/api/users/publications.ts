import { Meteor } from 'meteor/meteor';
import { User } from './users';

if (Meteor.isServer) {
  // Publish current user data
  Meteor.publish('userData', function() {
    if (!this.userId) {
      return this.ready();
    }

    return Meteor.users.find(
      { _id: this.userId },
      {
        fields: {
          emails: 1,
          profile: 1,
          createdAt: 1,
        },
      }
    );
  });

  // Publish online users for chat
  Meteor.publish('onlineUsers', function() {
    if (!this.userId) {
      return this.ready();
    }

    return Meteor.users.find(
      { 
        'profile.status': { $in: ['online', 'away'] },
        _id: { $ne: this.userId } // Exclude current user
      },
      {
        fields: {
          'profile.firstName': 1,
          'profile.lastName': 1,
          'profile.avatar': 1,
          'profile.status': 1,
          'profile.lastSeen': 1,
        },
        sort: { 'profile.lastSeen': -1 },
        limit: 100, // Limit to prevent performance issues
      }
    );
  });

  // Publish all users (for admin purposes or user search)
  Meteor.publish('allUsers', function(limit: number = 50) {
    if (!this.userId) {
      return this.ready();
    }

    // Only allow if user is admin (you can implement admin check here)
    // For now, we'll allow all authenticated users to see basic user info
    return Meteor.users.find(
      {},
      {
        fields: {
          'profile.firstName': 1,
          'profile.lastName': 1,
          'profile.avatar': 1,
          'profile.status': 1,
          'profile.lastSeen': 1,
        },
        sort: { 'profile.lastSeen': -1 },
        limit: Math.min(limit, 100), // Cap at 100 users
      }
    );
  });

  // Update user status on connection/disconnection
  Meteor.onConnection((connection) => {
    connection.onClose(() => {
      const userId = connection._session?.userId;
      if (userId) {
        // Set user offline when connection closes
        Meteor.users.updateAsync(userId, {
          $set: {
            'profile.status': 'offline',
            'profile.lastSeen': new Date(),
          },
        }).catch((error) => {
          console.error('Error updating user status on disconnect:', error);
        });
      }
    });
  });

  // Cleanup function to set users offline after inactivity
  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  Meteor.setInterval(async () => {
    const cutoff = new Date(Date.now() - INACTIVITY_TIMEOUT);
    
    try {
      await Meteor.users.updateAsync(
        {
          'profile.status': { $in: ['online', 'away'] },
          'profile.lastSeen': { $lt: cutoff },
        },
        {
          $set: {
            'profile.status': 'offline',
          },
        },
        { multi: true }
      );
    } catch (error) {
      console.error('Error updating inactive user statuses:', error);
    }
  }, 60000); // Run every minute
}
