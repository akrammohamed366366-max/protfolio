import React from 'react';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Chip } from '../ui/Chip';

export const Skills: React.FC = () => {
  const { lang } = useLanguage();
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      id="skills"
      ref={ref}
      className={`py-16 sm:py-24 border-t border-brand-border bg-brand-bg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <Container>
        <SectionHeading
          eyebrow={site.skills.eyebrow[lang]}
          title={site.skills.title[lang]}
        />

        {/* Text chips only: no logos, no percentages, no bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {site.skills.categories.map((category) => (
            <Card
              key={category.id}
              variant="default"
              padding="md"
              className="flex flex-col justify-between text-start"
            >
              <div>
                <h3 className="text-base font-bold text-brand-navy mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-brand-cyan" aria-hidden="true" />
                  <span>{category.title[lang]}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <Chip key={skill} size="md">
                      {skill}
                    </Chip>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
