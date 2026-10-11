import React from 'react';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { useProjects } from '../../hooks/useProjects';
import { useFadeInOnScroll } from '../../hooks/useFadeInOnScroll';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { ProjectCard } from '../ui/ProjectCard';
import { Card } from '../ui/Card';

export const Projects: React.FC = () => {
  const { lang } = useLanguage();
  const { projects, loading } = useProjects();
  const { ref, isVisible } = useFadeInOnScroll<HTMLElement>();

  return (
    <section
      id="projects"
      ref={ref}
      className={`py-16 sm:py-24 border-t border-brand-border bg-brand-bg transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      <Container>
        <SectionHeading
          eyebrow={site.projects.eyebrow[lang]}
          title={site.projects.title[lang]}
        />

        {loading ? (
          <div className="flex flex-col gap-12 sm:gap-16">
            {[1, 2].map((idx) => (
              <Card
                key={idx}
                variant="default"
                padding="none"
                className="overflow-hidden flex flex-col lg:flex-row border border-brand-border animate-pulse"
              >
                <div className="lg:w-7/12 bg-brand-navy p-6 sm:p-8 flex flex-col justify-between">
                  <div className="h-6 w-32 bg-brand-navy-dark rounded mb-6" />
                  <div className="aspect-[16/10] w-full rounded-lg bg-brand-navy-dark border border-dashed border-brand-border-dark" />
                  <div className="h-4 w-24 bg-brand-navy-dark rounded mt-4" />
                </div>
                <div className="lg:w-5/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="h-4 w-20 bg-brand-chip rounded mb-3" />
                    <div className="h-7 w-3/4 bg-brand-chip rounded mb-4" />
                    <div className="h-16 w-full bg-brand-chip rounded mb-6" />
                    <div className="space-y-2">
                      <div className="h-4 w-5/6 bg-brand-chip rounded" />
                      <div className="h-4 w-4/6 bg-brand-chip rounded" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-6">
                    <div className="h-6 w-16 bg-brand-chip rounded" />
                    <div className="h-6 w-16 bg-brand-chip rounded" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12 sm:gap-16">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                index={index}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
};
