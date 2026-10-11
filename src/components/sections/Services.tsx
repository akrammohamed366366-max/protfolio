import React from 'react';
import { useLanguage } from '../../i18n';
import { site, ServiceItem } from '../../content/site';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

const ServiceIcon: React.FC<{ iconType: ServiceItem['iconType'] }> = ({ iconType }) => {
  const iconProps = {
    className: 'w-6 h-6 text-brand-navy',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.75',
    viewBox: '0 0 24 24',
    'aria-hidden': 'true' as const,
  };

  switch (iconType) {
    case 'corporate':
      // Business / Corporate building
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case 'landing':
      // Focused Landing Page / conversion pointer
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case 'ecommerce':
      // Shopping cart / E-commerce bag
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      );
    case 'responsive':
      // Multi-device responsive
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case 'dashboard':
      // Admin dashboard / layout
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10-4a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
        </svg>
      );
    case 'auth':
      // Auth & Database lock/database
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      );
    case 'refinement':
      // Website improvements / sparkle
      return (
        <svg {...iconProps}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
    default:
      return null;
  }
};
export const Services: React.FC = () => {
  const { lang } = useLanguage();
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      id="services"
      ref={ref}
      className={`py-16 sm:py-24 border-t border-brand-border bg-brand-bg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <Container>
        <SectionHeading
          eyebrow={site.services.eyebrow[lang]}
          title={site.services.title[lang]}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {site.services.items.map((service) => (
            <Card
              key={service.id}
              variant="interactive"
              padding="lg"
              className="flex flex-col justify-between text-start"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-chip border border-brand-border flex items-center justify-center shadow-brand-sm">
                    <ServiceIcon iconType={service.iconType} />
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-muted bg-brand-chip px-2.5 py-1 rounded-md border border-brand-border">
                    {service.order}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-brand-navy mb-3">
                  {service.title[lang]}
                </h3>
                <p className="text-sm text-brand-muted leading-relaxed">
                  {service.description[lang]}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
