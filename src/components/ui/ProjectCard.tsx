import React from 'react';
import { ProjectItem } from '../../content/site';
import { site } from '../../content/site';
import { Language } from '../../i18n';
import { Card } from './Card';
import { Chip } from './Chip';
import { resolveAssetUrl } from '../../lib/assets';

export interface ProjectCardProps {
  project: ProjectItem;
  lang: Language;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, lang, index }) => {
  const hasLiveUrl = Boolean(project.liveUrl && project.liveUrl.trim().length > 0);
  const hasCaseStudyUrl = Boolean(project.caseStudyUrl && project.caseStudyUrl.trim().length > 0);

  return (
    <Card
      variant="default"
      padding="none"
      className="overflow-hidden flex flex-col lg:flex-row border border-brand-border"
    >
      {/* Project Screenshot / Framed Placeholder */}
      <div
        className={`lg:w-7/12 bg-brand-navy p-6 sm:p-8 flex flex-col justify-between ${
          index % 2 === 1 ? 'lg:order-2' : 'lg:order-1'
        }`}
      >
        {/* Browser header chrome */}
        <div className="flex items-center justify-between pb-4 border-b border-brand-border-dark mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-muted-light/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-muted-light/30" />
            <span className="w-2.5 h-2.5 rounded-full bg-brand-muted-light/30" />
          </div>
          <div className="px-3 py-1 rounded bg-brand-navy-dark text-[11px] font-mono text-brand-muted-light truncate max-w-[220px]">
            {project.id === 'dahr' ? 'dahr-fragrances.example' : 'study-abroad-portal.example'}
          </div>
          <div className="w-10" />
        </div>

        {/* Framed Placeholder or Real Screenshot */}
        <div className="aspect-[16/10] w-full rounded-lg bg-brand-navy-dark border border-dashed border-brand-border-dark flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          {project.imageUrl ? (
            <img
              src={resolveAssetUrl(project.imageUrl)}
              alt={project.title[lang]}
              loading="lazy"
              width={800}
              height={500}
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-xl bg-brand-navy border border-brand-border-dark flex items-center justify-center text-brand-cyan mb-4 font-mono font-bold text-lg shadow-brand-sm">
                0{project.order}
              </div>
              <p className="text-sm font-mono text-brand-muted-light max-w-sm leading-relaxed select-none">
                {site.projects.placeholderLabel[lang]}
              </p>
            </div>
          )}
        </div>

        {/* Mockup footer bar */}
        <div className="pt-4 flex items-center justify-between text-[11px] font-mono text-brand-muted-light">
          <span>16:10 Layout</span>
          <span className="text-brand-cyan">UI / Frontend</span>
        </div>
      </div>

      {/* Project Details */}
      <div
        className={`lg:w-5/12 p-6 sm:p-8 lg:p-10 flex flex-col justify-between text-start ${
          index % 2 === 1 ? 'lg:order-1' : 'lg:order-2'
        }`}
      >
        <div>
          <span className="text-xs font-mono font-semibold tracking-wider uppercase text-brand-muted block mb-2">
            {project.category[lang]}
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold text-brand-navy mb-4">
            {project.title[lang]}
          </h3>
          <p className="text-sm sm:text-base text-brand-muted leading-relaxed mb-6">
            {project.description[lang]}
          </p>

          {/* Features List */}
          <div className="mb-6">
            <span className="text-xs font-mono uppercase text-brand-muted block mb-3 font-semibold">
              {site.projects.featuresLabel[lang]}
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-brand-navy">
              {project.features[lang].map((feature, fIndex) => (
                <li key={fIndex} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan mt-1.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Tools & Links */}
        <div>
          {/* Tools */}
          <div className="mb-6">
            <span className="text-xs font-mono uppercase text-brand-muted block mb-3 font-semibold">
              {site.projects.technologiesLabel[lang]}
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <Chip key={tool} size="sm">
                  {tool}
                </Chip>
              ))}
            </div>
          </div>

          {/* Action Buttons: View Project & optional Read Case Study */}
          <div className="pt-4 border-t border-brand-border flex flex-wrap items-center gap-3">
            {hasLiveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-cyan text-brand-navy text-xs font-semibold hover:bg-brand-cyan-hover transition-colors shadow-brand-sm cursor-pointer"
              >
                <span>{site.projects.viewProjectBtn[lang]}</span>
                <span className="font-mono" aria-hidden="true">↗</span>
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-chip text-brand-muted text-xs font-semibold cursor-not-allowed border border-brand-border select-none"
              >
                <span>{site.projects.linkComingSoonBtn[lang]}</span>
              </button>
            )}

            {/* Read case study (only appears when caseStudyUrl exists) */}
            {hasCaseStudyUrl && (
              <a
                href={project.caseStudyUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-transparent border border-brand-border text-brand-navy text-xs font-semibold hover:bg-brand-chip transition-colors cursor-pointer"
              >
                <span>{site.projects.readCaseStudyBtn[lang]}</span>
                <span className="font-mono" aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
