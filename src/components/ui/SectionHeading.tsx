import React from 'react';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'start' | 'center';
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'start',
  className = '',
}) => {
  const alignClasses =
    align === 'center'
      ? 'text-center mx-auto items-center'
      : 'text-start items-start';

  return (
    <div className={`flex flex-col mb-10 md:mb-14 ${alignClasses} ${className}`}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-brand-chip border border-brand-border text-brand-muted font-mono text-xs tracking-wider mb-3 w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
          <span>{eyebrow}</span>
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-brand-navy">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base sm:text-lg text-brand-muted max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
