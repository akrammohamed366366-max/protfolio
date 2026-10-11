import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useLanguage } from '../../i18n';
import { site } from '../../content/site';
import { Container } from '../ui/Container';
import { SHOW_ADMIN_LINK, ADMIN_UID } from '../../config';
import { auth } from '../../lib/firebase';

export const Navbar: React.FC = () => {
  const { lang, toggleLang, isAr } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Track Firebase auth state to detect if admin is logged in
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isAdminSignedIn = Boolean(currentUser && currentUser.uid === ADMIN_UID);
  const adminButtonLabel = isAdminSignedIn
    ? site.nav.dashboard[lang]
    : site.nav.signIn[lang];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trap focus and handle Escape when mobile menu is open
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setMobileMenuOpen(false);
        hamburgerRef.current?.focus();
        return;
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Focus the first item in the mobile menu after opening
    const timer = setTimeout(() => {
      if (menuRef.current) {
        const firstFocusable = menuRef.current.querySelector<HTMLElement>('a, button');
        firstFocusable?.focus();
      }
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [mobileMenuOpen]);

  const closeMenuAndRestoreFocus = () => {
    setMobileMenuOpen(false);
    hamburgerRef.current?.focus();
  };

  const navLinks = [
    { id: 'home', label: site.nav.home[lang] },
    { id: 'about', label: site.nav.about[lang] },
    { id: 'services', label: site.nav.services[lang] },
    { id: 'projects', label: site.nav.projects[lang] },
  ];

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-brand-card/95 backdrop-blur-md border-brand-border shadow-brand-sm'
          : 'bg-brand-bg border-transparent'
      }`}
    >
      <Container>
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo / Brand Name */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="group flex items-center gap-3 cursor-pointer select-none text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded-lg"
            aria-label={`${site.profile.name[lang]} - ${site.profile.role[lang]}`}
          >
            <div className="w-9 h-9 rounded-lg bg-brand-navy text-brand-cyan flex items-center justify-center font-mono font-bold text-base shadow-brand-sm group-hover:scale-105 transition-transform">
              {isAr ? 'أ' : 'A'}
            </div>
            <div className="flex flex-col text-start">
              <span className="font-bold text-base text-brand-navy tracking-tight leading-none group-hover:text-brand-navy-dark transition-colors">
                {site.profile.name[lang]}
              </span>
              <span className="text-[11px] font-mono text-brand-muted mt-1 leading-none">
                {site.profile.role[lang]}
              </span>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => handleNavClick(link.id)}
                className="text-sm font-medium text-brand-muted hover:text-brand-navy transition-colors py-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan rounded"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Right Action: Language Switcher, Sign In Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Desktop Language Switcher 'EN | عربي' */}
            <button
              type="button"
              onClick={toggleLang}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              aria-label="Toggle language: EN | عربي"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
              <span>{site.nav.langToggle[lang]}</span>
            </button>

            {/* Desktop Sign in / Dashboard Button */}
            {SHOW_ADMIN_LINK && (
              <Link
                to="/admin"
                className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-navy text-brand-navy hover:bg-brand-navy/5 text-xs font-medium transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              >
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>{adminButtonLabel}</span>
              </Link>
            )}

            {/* Mobile Hamburger Button */}
            <button
              ref={hamburgerRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-brand-navy hover:bg-brand-chip border border-brand-border transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2"
              aria-label={mobileMenuOpen ? 'Close mobile menu' : 'Open mobile menu'}
              aria-expanded={mobileMenuOpen}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden border-t border-brand-border bg-brand-card shadow-brand-lg"
        >
          <Container className="py-4">
            <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-brand-muted hover:text-brand-navy hover:bg-brand-chip transition-colors text-start cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                >
                  {link.label}
                </button>
              ))}

              {/* Mobile Sign in / Dashboard Button */}
              {SHOW_ADMIN_LINK && (
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="min-h-[44px] px-3.5 py-2.5 rounded-lg border border-brand-navy text-brand-navy hover:bg-brand-navy/5 text-sm font-medium transition-colors inline-flex items-center justify-start gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
                >
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{adminButtonLabel}</span>
                </Link>
              )}

              {/* Language toggle inside mobile menu */}
              <div className="pt-3 mt-1 border-t border-brand-border flex items-center justify-between px-3">
                <span className="text-xs font-mono text-brand-muted">
                  {isAr ? 'اللغة' : 'Language'}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    toggleLang();
                  }}
                  className="min-h-[44px] inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer"
                  aria-label="Toggle language: EN | عربي"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
                  <span>{site.nav.langToggle[lang]}</span>
                </button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
};
