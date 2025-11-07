import React from 'react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={`
          flex h-10 w-full rounded-lg border px-3 py-2 text-sm 
          file:border-0 file:bg-transparent file:text-sm file:font-medium 
          placeholder:text-gray-400 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50
          transition-colors duration-200
          ${error 
            ? 'border-danger-300 focus-visible:ring-danger-500 focus-visible:border-danger-500' 
            : 'border-gray-300 focus-visible:ring-primary-500 focus-visible:border-primary-500'
          }
          ${className || ''}
        `}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
