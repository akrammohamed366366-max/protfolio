import React from 'react';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const About: React.FC = () => {
  const { lang } = useLanguage();
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      id="about"
      ref={ref}
      className={`py-16 sm:py-24 border-t border-brand-border bg-brand-bg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <Container>
        <SectionHeading
          eyebrow={site.about.eyebrow[lang]}
          title={site.about.title[lang]}
        />

        <div className="max-w-4xl">
          <Card padding="lg" className="border border-brand-border">
            <p className="text-base sm:text-lg md:text-xl text-brand-navy leading-relaxed font-normal text-start">
              {site.about.text[lang]}
            </p>
          </Card>
        </div>
      </Container>
    </section>
  );
};
