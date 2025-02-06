import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const variantStyles = {
      default: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'border border-blue-500 text-blue-500 hover:bg-blue-50',
      ghost: 'hover:bg-gray-100'
    };

    return (
      <button
        ref={ref}
        className={cn(
          'px-4 py-2 rounded-md transition-colors',
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';