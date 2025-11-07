import React, { useState } from 'react';
import { useAuth } from '/imports/ui/contexts/AuthContext';
import { UserProfile } from '/imports/ui/components/auth';

export const ChatLayout: React.FC = () => {
  const { user } = useAuth();
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Chat App</h1>
          </div>
          
          <div className="relative">
            <button 
              className="flex items-center space-x-3 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setShowProfile(!showProfile)}
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-500 flex items-center justify-center text-white font-medium">
                {user?.profile?.avatar ? (
                  <img 
                    src={user.profile.avatar} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm">
                    {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {user?.profile?.firstName} {user?.profile?.lastName}
              </span>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <UserProfile onClose={() => setShowProfile(false)} />
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Online Users</h3>
          </div>
          <div className="flex-1 p-4">
            <div className="text-center text-gray-500 mt-8">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm">Chat functionality coming soon...</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-2xl mx-auto text-center mt-20">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-200">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Chat App!</h2>
                <p className="text-gray-600 mb-2">
                  You're successfully authenticated as{' '}
                  <span className="font-semibold text-primary-600">
                    {user?.profile?.firstName} {user?.profile?.lastName}
                  </span>
                </p>
                <p className="text-gray-500 text-sm">
                  Chat functionality will be implemented next.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center space-x-4">
              <input 
                type="text" 
                placeholder="Type a message..." 
                disabled
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button 
                className="btn btn-primary px-6 py-2" 
                disabled
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
