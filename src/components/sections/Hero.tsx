import React from 'react';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { useProfile } from '../../hooks/useProfile';
import { Container } from '../ui/Container';
import { Button } from '../ui/Button';
import { resolveAssetUrl } from '../../lib/assets';

export const Hero: React.FC = () => {
  const { lang, isAr } = useLanguage();
  const { profile, loading } = useProfile();

  const handleScrollToProjects = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36 overflow-hidden">
      <Container>
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Circular Photo / Placeholder (about 180px, thin cyan ring, soft shadow) */}
          <div className="mb-8 relative">
            <div className="w-[180px] h-[180px] rounded-full p-1 bg-brand-card ring-2 ring-brand-cyan shadow-brand-md flex items-center justify-center overflow-hidden">
              {loading ? (
                <div className="w-full h-full rounded-full bg-brand-chip animate-pulse" />
              ) : profile.photoUrl ? (
                <img
                  src={resolveAssetUrl(profile.photoUrl)}
                  alt={profile.photoAlt?.[lang] || profile.name[lang]}
                  width={180}
                  height={180}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-brand-chip border border-dashed border-brand-border flex flex-col items-center justify-center p-4">
                  <div className="w-12 h-12 rounded-full bg-brand-navy text-brand-cyan flex items-center justify-center font-mono font-bold text-lg mb-2 shadow-brand-sm">
                    {isAr ? 'أ' : 'A'}
                  </div>
                  <span className="text-xs font-mono text-brand-muted select-none">
                    {site.hero.photoPlaceholder[lang]}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Name & Role Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-chip border border-brand-border text-brand-navy text-xs font-mono font-medium tracking-wide mb-5">
            <span className="w-2 h-2 rounded-full bg-brand-cyan" aria-hidden="true" />
            <span className="font-bold">{site.profile.name[lang]}</span>
            <span className="text-brand-border-dark/40" aria-hidden="true">·</span>
            <span>{site.profile.role[lang]}</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-brand-navy leading-tight">
            {site.hero.headline[lang]}
          </h1>

          {/* Text */}
          <p className="mt-6 text-base sm:text-lg text-brand-muted leading-relaxed max-w-2xl">
            {site.hero.text[lang]}
          </p>

          {/* ONE Action Button: View My Work / شاهد أعمالي */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleScrollToProjects}
            >
              <span>{site.hero.button[lang]}</span>
              <span
                className="inline-block font-mono transition-transform rtl:rotate-180"
                aria-hidden="true"
              >
                →
              </span>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};
