import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  children,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 rounded-md gap-1.5',
    md: 'text-sm px-5 py-2.5 rounded-lg gap-2',
    lg: 'text-base px-6 py-3.5 rounded-xl gap-2.5 font-semibold',
  };

  // Navy text on cyan buttons per visual rules!
  const variantClasses = {
    primary:
      'bg-brand-cyan text-brand-navy hover:bg-brand-cyan-hover shadow-brand-sm active:translate-y-px',
    secondary:
      'bg-brand-navy text-brand-white hover:bg-brand-navy-dark shadow-brand-sm active:translate-y-px',
    outline:
      'bg-transparent text-brand-navy border border-brand-border hover:border-brand-navy hover:bg-brand-chip',
    ghost:
      'bg-transparent text-brand-navy hover:bg-brand-chip',
  };

  const combinedClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (href) {
    return (
      <a href={href} className={combinedClasses}>
        {children}
      </a>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
};
