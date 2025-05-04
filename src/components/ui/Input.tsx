import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className, fullWidth = true, ...props }, ref) => {
    return (
      <div className={cn('mb-4', fullWidth ? 'w-full' : 'w-auto')}>
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-neutral-700 mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'px-4 py-2 bg-white border rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all duration-200',
            error
              ? 'border-error-500 focus:border-error-500 focus:ring-error-500/20'
              : 'border-neutral-300 focus:border-brand-500 focus:ring-brand-500/20',
            fullWidth ? 'w-full' : 'w-auto',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-sm text-error-600">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-sm text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;