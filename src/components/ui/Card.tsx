import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'muted' | 'interactive';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  ...props
}) => {
  const baseClasses = 'rounded-xl transition-all duration-200';

  const variantClasses = {
    default:
      'bg-brand-card border border-brand-border shadow-card hover:-translate-y-0.5 hover:shadow-brand-md',
    muted: 'bg-brand-chip border border-brand-border hover:-translate-y-0.5',
    interactive:
      'bg-brand-card border border-brand-border shadow-card hover:border-brand-navy/30 hover:-translate-y-1 hover:shadow-brand-lg',
  };

  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
