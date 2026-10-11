import React from 'react';

export interface ChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'default' | 'accent';
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center font-medium transition-colors select-none';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 rounded-md gap-1',
    md: 'text-sm px-3.5 py-1.5 rounded-lg gap-1.5',
  };

  const variantClasses = {
    default:
      'bg-brand-chip text-brand-navy border border-brand-border hover:bg-brand-chip-hover',
    accent:
      'bg-brand-cyan-soft text-brand-navy border border-brand-cyan/30',
  };

  return (
    <span
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
