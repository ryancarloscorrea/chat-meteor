# Chat Meteor - Authentication System

A modern chat application built with Meteor.js, React, TypeScript, and Tailwind CSS, featuring a comprehensive authentication system following best practices and clean code principles.

## 🚀 Features

### Authentication System
- ✅ **User Registration** - Complete signup flow with validation
- ✅ **User Login** - Secure authentication with email/password
- ✅ **Profile Management** - Edit profile information and avatar
- ✅ **Password Management** - Change password functionality
- ✅ **User Status** - Online/offline/away status tracking
- ✅ **Session Management** - Automatic logout on inactivity
- ✅ **Email Verification** - Built-in email verification system

### Security Features
- ✅ **Rate Limiting** - Protection against brute force attacks
- ✅ **Input Validation** - Comprehensive client and server-side validation
- ✅ **Authentication Guards** - Protected routes and components
- ✅ **Secure Sessions** - 30-day login expiration
- ✅ **Connection Monitoring** - Automatic status updates on disconnect

### UI/UX Features
- ✅ **Modern Design** - Beautiful Tailwind CSS styling
- ✅ **Responsive Layout** - Works on all device sizes
- ✅ **Loading States** - Smooth loading indicators
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Animations** - Smooth transitions and micro-interactions
- ✅ **Accessibility** - ARIA labels and keyboard navigation

## 🛠 Technology Stack

- **Backend**: Meteor.js with TypeScript
- **Frontend**: React 18 with TypeScript
- **UI Components**: Radix UI (unstyled, accessible components)
- **Database**: MongoDB (built-in with Meteor)
- **Styling**: Tailwind CSS
- **Authentication**: Meteor Accounts system
- **Real-time**: Meteor's DDP protocol
- **Security**: DDPRateLimiter, input validation

## 📁 Project Structure

```
chat-meteor/
├── client/
│   ├── main.css          # Tailwind CSS configuration
│   ├── main.html         # HTML template
│   └── main.tsx          # Client entry point
├── imports/
│   ├── api/
│   │   ├── users/        # User-related API
│   │   │   ├── users.ts      # User types and configuration
│   │   │   ├── methods.ts    # Server methods
│   │   │   ├── publications.ts # Data publications
│   │   │   └── index.ts      # API exports
│   │   └── security/     # Security configurations
│   │       ├── rateLimiting.ts # Rate limiting rules
│   │       └── index.ts      # Security exports
│   └── ui/
│       ├── components/
│       │   ├── ui/       # Radix UI components
│       │   │   ├── Button.tsx
│       │   │   ├── Input.tsx
│       │   │   ├── Label.tsx
│       │   │   ├── Avatar.tsx
│       │   │   ├── DropdownMenu.tsx
│       │   │   └── index.ts
│       │   ├── auth/     # Authentication components
│       │   │   ├── LoginForm.tsx
│       │   │   ├── RegisterForm.tsx
│       │   │   ├── AuthModal.tsx
│       │   │   ├── UserProfile.tsx
│       │   │   └── index.ts
│       │   ├── chat/     # Chat components
│       │   │   ├── ChatLayout.tsx
│       │   │   └── index.ts
│       │   └── common/   # Shared components
│       │       ├── PrivateRoute.tsx
│       │       ├── LoadingSpinner.tsx
│       │       └── index.ts
│       ├── contexts/
│       │   └── AuthContext.tsx # Authentication context
│       └── App.tsx       # Main app component
├── server/
│   └── main.ts          # Server entry point
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── tsconfig.json        # TypeScript configuration
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Meteor.js
- MongoDB (included with Meteor)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chat-meteor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   meteor
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔐 Authentication Flow

### User Registration
1. User fills out registration form (first name, last name, email, password)
2. Client-side validation checks input format and requirements
3. Server-side validation ensures data integrity
4. User account is created with default profile
5. Verification email is sent automatically
6. User is automatically logged in after registration

### User Login
1. User enters email and password
2. Credentials are validated against the database
3. Session is created with 30-day expiration
4. User status is set to "online"
5. User is redirected to the chat interface

### Profile Management
1. Users can edit their profile information
2. Avatar URLs can be added for profile pictures
3. Password changes require current password verification
4. All changes are validated and saved securely

### Security Measures
- **Rate Limiting**: 
  - 3 login attempts per minute
  - 2 registrations per 5 minutes
  - 5 method calls per minute for other operations
- **Input Validation**: All inputs are validated on both client and server
- **Session Security**: Automatic logout after inactivity
- **Connection Monitoring**: Status updates when users disconnect

## 🎨 Styling with Tailwind CSS

The application uses a custom Tailwind CSS configuration with:

- **Custom Color Palette**: Primary, success, and danger color schemes
- **Custom Components**: Reusable button and form styles
- **Responsive Design**: Mobile-first approach
- **Animations**: Smooth transitions and loading states
- **Typography**: Inter font family for modern look

### Key CSS Classes
- `.btn` - Base button styling
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary action buttons
- `.btn-danger` - Destructive action buttons
- `.form-input` - Input field styling
- `.error-message` - Error text styling
- `.success-message` - Success notification styling

## 🔧 API Reference

### Authentication Methods

#### `users.register(userData)`
Creates a new user account.
```typescript
interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
```

#### `users.updateProfile(profileData)`
Updates user profile information.
```typescript
interface ProfileData {
  firstName?: string;
  lastName?: string;
  avatar?: string;
}
```

#### `users.updateStatus(status)`
Updates user online status.
```typescript
type Status = 'online' | 'offline' | 'away';
```

#### `users.changePassword(oldPassword, newPassword)`
Changes user password with verification.

### Publications

#### `userData`
Publishes current user's data including emails and profile.

#### `onlineUsers`
Publishes list of currently online users (excluding current user).

#### `allUsers`
Publishes all users with basic profile information (limited to 100).

## 🧪 Testing

The application includes comprehensive error handling and validation:

- **Client-side validation** for immediate feedback
- **Server-side validation** for security
- **Rate limiting** to prevent abuse
- **Connection monitoring** for real-time status updates

## 🚀 Next Steps

The authentication system is complete and ready for chat functionality implementation:

1. **Message System** - Create message collection and real-time messaging
2. **Chat Rooms** - Implement multiple chat rooms or channels
3. **File Sharing** - Add file upload and sharing capabilities
4. **Push Notifications** - Implement real-time notifications
5. **Admin Panel** - Add user management and moderation features

## 📝 Best Practices Implemented

- **Clean Code**: Well-organized, readable, and maintainable code
- **TypeScript**: Full type safety throughout the application
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Security**: Multiple layers of security and validation
- **Performance**: Optimized queries and efficient data loading
- **Accessibility**: ARIA labels and keyboard navigation support
- **Responsive Design**: Works seamlessly on all devices
- **Code Organization**: Modular structure with clear separation of concerns

## 🤝 Contributing

This project follows clean code principles and best practices. When contributing:

1. Follow the existing code structure and naming conventions
2. Add TypeScript types for all new functionality
3. Include proper error handling and validation
4. Write descriptive commit messages in English
5. Test all authentication flows before submitting

## 📄 License

This project is created for educational purposes and follows modern web development best practices.
