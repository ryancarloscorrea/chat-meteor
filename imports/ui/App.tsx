import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/common';
import { ChatLayout } from './components/chat';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="h-full">
        <PrivateRoute>
          <ChatLayout />
        </PrivateRoute>
      </div>
    </AuthProvider>
  );
};
