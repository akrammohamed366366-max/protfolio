import React from 'react';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { useProfile } from '../../hooks/useProfile';
import { Container } from '../ui/Container';

export const Footer: React.FC = () => {
  const { lang } = useLanguage();
  const { profile } = useProfile();

  const navLinks = [
    { id: 'home', label: site.nav.home[lang] },
    { id: 'about', label: site.nav.about[lang] },
    { id: 'services', label: site.nav.services[lang] },
    { id: 'projects', label: site.nav.projects[lang] },
  ];

  const handleNavClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const activeProfileLinks = (
    Object.entries(profile.links) as [keyof typeof profile.links, string][]
  ).filter(([, url]) => typeof url === 'string' && url.trim().length > 0);

  return (
    <footer className="w-full bg-brand-card border-t border-brand-border py-12 md:py-16">
      <Container>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          {/* Identity */}
          <div className="flex flex-col text-start">
            <span className="font-bold text-lg text-brand-navy tracking-tight">
              {site.profile.name[lang]}
            </span>
            <span className="text-xs font-mono text-brand-muted mt-1">
              {site.profile.role[lang]}
            </span>
          </div>

          {/* Navigation Links (Home, About, Services, Projects) */}
          <nav className="flex flex-wrap items-center gap-6" aria-label="Footer Navigation">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="text-xs font-medium text-brand-muted hover:text-brand-navy transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Bar: Optional Profile Links & Copyright */}
        <div className="mt-8 pt-8 border-t border-brand-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-brand-muted text-start">
          {/* Optional Profile Links (rendered only if URL is non-empty) */}
          {activeProfileLinks.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3">
              {activeProfileLinks.map(([key, url], idx) => {
                const label = site.footer.profileLabels[key]?.[lang] || key;
                return (
                  <React.Fragment key={key}>
                    {idx > 0 && <span aria-hidden="true">·</span>}
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-bold text-brand-navy hover:text-brand-navy-dark"
                    >
                      {label} ↗
                    </a>
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <div />
          )}

          {/* Copyright: © 2026 Akram Sherif. All rights reserved. / © 2026 أكرم شريف. جميع الحقوق محفوظة. */}
          <p>{site.footer.copyright[lang]}</p>
        </div>
      </Container>
    </footer>
  );
};
