import React from 'react';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const Process: React.FC = () => {
  const { lang } = useLanguage();
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      id="process"
      ref={ref}
      className={`py-16 sm:py-24 border-t border-brand-border bg-brand-bg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <Container>
        <SectionHeading
          eyebrow={site.process.eyebrow[lang]}
          title={site.process.title[lang]}
        />

        {/* 4 numbered cards joined by a simple line; vertical on mobile */}
        <div className="relative">
          {/* Desktop Connecting Line (hidden on mobile) */}
          <div
            className="hidden lg:block absolute top-1/2 start-8 end-8 h-0.5 bg-brand-border -translate-y-8 z-0"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {site.process.steps.map((step, index) => (
              <div key={step.id} className="relative flex flex-col">
                {/* Mobile Connecting Line between cards */}
                {index < site.process.steps.length - 1 && (
                  <div
                    className="block sm:hidden absolute start-6 top-16 bottom-0 w-0.5 bg-brand-border -mb-6 z-0"
                    aria-hidden="true"
                  />
                )}

                <Card
                  variant="default"
                  padding="md"
                  className="relative z-10 flex flex-col justify-between h-full text-start border border-brand-border bg-brand-card"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <span className="font-mono text-sm font-bold text-brand-navy bg-brand-cyan px-3 py-1 rounded-md shadow-brand-sm">
                        {step.order}
                      </span>
                      <span className="w-2.5 h-2.5 rounded-full bg-brand-border" aria-hidden="true" />
                    </div>
                    <h3 className="text-lg font-bold text-brand-navy mb-2.5">
                      {step.title[lang]}
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
                      {step.description[lang]}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};
