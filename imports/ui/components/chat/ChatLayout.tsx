import React, { useState } from 'react';
import { ChevronDownIcon, PaperPlaneIcon, PersonIcon } from '@radix-ui/react-icons';
import { useAuth } from '/imports/ui/contexts/AuthContext';
import { UserProfile } from '/imports/ui/components/auth';
import { 
  Avatar, 
  AvatarImage, 
  AvatarFallback,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  Button,
  Input
} from '/imports/ui/components/ui';

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
          
          <DropdownMenu open={showProfile} onOpenChange={setShowProfile}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center space-x-3 px-4 py-2 h-auto"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage 
                    src={user?.profile?.avatar} 
                    alt="Profile"
                  />
                  <AvatarFallback>
                    {user?.profile?.firstName?.[0]}{user?.profile?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">
                  {user?.profile?.firstName} {user?.profile?.lastName}
                </span>
                <ChevronDownIcon className="w-4 h-4 text-gray-400" />
              </Button>
            </DropdownMenuTrigger>
            
            <DropdownMenuContent className="w-80" align="end">
              <UserProfile onClose={() => setShowProfile(false)} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Online Users</h3>
          </div>
          <div className="flex-1 p-4">
            <div className="text-center text-gray-500 mt-8">
              <PersonIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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
              <Input 
                type="text" 
                placeholder="Type a message..." 
                disabled
                className="flex-1"
              />
              <Button 
                size="icon"
                disabled
              >
                <PaperPlaneIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
