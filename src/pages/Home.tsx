import React from 'react';
import { useLanguage } from '../i18n';
import { site } from '../content/site';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { Services } from '../components/sections/Services';
import { Projects } from '../components/sections/Projects';
import { Skills } from '../components/sections/Skills';
import { Process } from '../components/sections/Process';

export const Home: React.FC = () => {
  const { lang } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-brand-bg text-brand-navy">
      {/* Skip to Content Accessible Link */}
      <button
        type="button"
        onClick={() => {
          const el = document.getElementById('main-content');
          el?.focus();
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:start-4 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-brand-navy focus:text-brand-cyan focus:font-semibold focus:text-sm focus:rounded-lg focus:shadow-brand-lg focus:ring-2 focus:ring-brand-cyan transition-all cursor-pointer"
      >
        {site.nav.skipToContent[lang]}
      </button>
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Skills />
        <Process />
      </main>
      <Footer />
    </div>
  );
};
