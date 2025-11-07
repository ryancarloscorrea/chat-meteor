import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Meteor } from 'meteor/meteor';
import { useTracker } from 'meteor/react-meteor-data';
import { User } from '/imports/api/users';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  const { user, isAuthenticated } = useTracker(() => {
    const user = Meteor.user() as User | null;
    const isAuthenticated = !!user;
    
    return {
      user,
      isAuthenticated,
    };
  }, []);

  useEffect(() => {
    // Handle initial loading state
    const handle = Meteor.subscribe('userData', {
      onReady: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });

    return () => handle.stop();
  }, []);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
