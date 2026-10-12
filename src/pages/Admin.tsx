import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { auth, db, isFirebaseConfigured, activeProjectId } from '../lib/firebase';
import { ADMIN_UID } from '../config';
import { site, ProjectItem } from '../content/site';
import { seedDefaultProjects } from '../lib/seed';
import { removeUndefined } from '../lib/firestoreUtils';
import { useLanguage } from '../i18n';

// Type definitions for Project Form
interface ProjectFormData {
  id?: string;
  order: number;
  published: boolean;
  categoryEn: string;
  categoryAr: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresEn: string; // one per line
  featuresAr: string; // one per line
  tools: string; // comma-separated
  imageUrl: string;
  liveUrl: string;
  caseStudyUrl: string;
}

const emptyProjectForm: ProjectFormData = {
  order: 1,
  published: true,
  categoryEn: '',
  categoryAr: '',
  titleEn: '',
  titleAr: '',
  descriptionEn: '',
  descriptionAr: '',
  featuresEn: '',
  featuresAr: '',
  tools: 'HTML, CSS, JavaScript, React',
  imageUrl: '',
  liveUrl: '',
  caseStudyUrl: '',
};

interface ProfileFormData {
  photoUrl: string;
  mostaql: string;
  khamsat: string;
  upwork: string;
}

export const Admin: React.FC = () => {
  const { lang, toggleLang, isAr, t } = useLanguage();

  // Robots meta tag: noindex, nofollow for /admin route & Page Title
  useEffect(() => {
    document.title = t('admin.metaTitle');

    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'robots';
      document.head.appendChild(meta);
      created = true;
    }
    const previous = meta.content;
    meta.content = 'noindex, nofollow';

    return () => {
      if (created && meta && meta.parentNode) {
        meta.parentNode.removeChild(meta);
      } else if (meta) {
        meta.content = previous;
      }
    };
  }, [lang, t]);

  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<{ code: string; message: string } | null>(null);

  // Active Tab: 'projects' | 'profile'
  const [activeTab, setActiveTab] = useState<'projects' | 'profile'>('projects');

  // Notification feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showFeedback = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  // Check auth state
  useEffect(() => {
    if (!auth) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check if current user is authorized admin
  const isAuthorizedAdmin = Boolean(
    currentUser &&
    currentUser.uid === ADMIN_UID
  );

  // Email & Password Form State
  const [emailInput, setEmailInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isSigningIn, setIsSigningIn] = useState<boolean>(false);
  const [isResettingPassword, setIsResettingPassword] = useState<boolean>(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  // Helper to map Firebase Auth error codes to user-friendly messages
  const getReadableAuthError = (code: string): string => {
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
      case 'auth/invalid-login-credentials':
        return t('admin.err.invalidCredential');
      case 'auth/invalid-email':
        return t('admin.err.invalidEmail');
      case 'auth/user-disabled':
        return t('admin.err.userDisabled');
      case 'auth/too-many-requests':
        return t('admin.err.tooManyRequests');
      case 'auth/network-request-failed':
        return t('admin.err.network');
      case 'auth/missing-password':
        return t('admin.err.missingPassword');
      default:
        return t('admin.err.unexpected');
    }
  };

  // Handle Email & Password Sign In
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setAuthError({
        code: 'auth/not-configured',
        message: t('admin.err.notConfigured'),
      });
      return;
    }

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      setAuthError({
        code: 'auth/invalid-email',
        message: t('admin.err.invalidEmail'),
      });
      return;
    }

    if (!passwordInput) {
      setAuthError({
        code: 'auth/missing-password',
        message: t('admin.err.missingPassword'),
      });
      return;
    }

    setAuthError(null);
    setResetMessage(null);
    setIsSigningIn(true);

    try {
      await signInWithEmailAndPassword(auth, trimmedEmail, passwordInput);
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      const code = fbErr?.code || 'auth/unknown-error';
      const message = getReadableAuthError(code);
      setAuthError({ code, message });
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!auth) {
      setAuthError({
        code: 'auth/not-configured',
        message: t('admin.err.notConfigured'),
      });
      return;
    }

    const trimmedEmail = emailInput.trim();
    if (!trimmedEmail) {
      setAuthError({
        code: 'auth/invalid-email',
        message: t('admin.err.enterEmailForReset'),
      });
      return;
    }

    setAuthError(null);
    setResetMessage(null);
    setIsResettingPassword(true);

    try {
      await sendPasswordResetEmail(auth, trimmedEmail);
      setResetMessage(t('admin.resetSuccessDesc'));
    } catch (err: unknown) {
      const fbErr = err as { code?: string; message?: string };
      const code = fbErr?.code || 'auth/unknown-error';
      const message = getReadableAuthError(code);
      setAuthError({ code, message });
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    if (!auth) return;
    try {
      await signOut(auth);
      setFeedback(null);
      setPasswordInput('');
      setAuthError(null);
      setResetMessage(null);
    } catch (err) {
      console.warn('Sign out error:', err);
    }
  };

  // =========================================================================
  // TAB 1: PROJECTS LOGIC
  // =========================================================================
  const [projectsList, setProjectsList] = useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = useState<boolean>(false);
  const [isEditingProject, setIsEditingProject] = useState<boolean>(false);
  const [projectForm, setProjectForm] = useState<ProjectFormData>(emptyProjectForm);
  const [projectSaving, setProjectSaving] = useState<boolean>(false);
  const [projectFormError, setProjectFormError] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState<boolean>(false);

  // Fetch all projects from Firestore
  const fetchAdminProjects = useCallback(async () => {
    if (!db) return;
    setProjectsLoading(true);
    try {
      const projectsRef = collection(db, 'projects');
      const q = query(projectsRef, orderBy('order', 'asc'));
      const snapshot = await getDocs(q);

      const items: ProjectItem[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          order: data.order ?? 1,
          category: data.category || { en: '', ar: '' },
          title: data.title || { en: '', ar: '' },
          description: data.description || { en: '', ar: '' },
          features: data.features || { en: [], ar: [] },
          tools: data.tools || [],
          imageUrl: data.imageUrl || '',
          liveUrl: data.liveUrl || '',
          caseStudyUrl: data.caseStudyUrl || '',
          published: data.published ?? true,
        } as ProjectItem & { published: boolean };
      });

      setProjectsList(items);
    } catch (err) {
      showFeedback('error', `${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProjectsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isAuthorizedAdmin && db) {
      fetchAdminProjects();
    }
  }, [isAuthorizedAdmin, fetchAdminProjects]);

  // URL Validator (must start with https:// or be empty)
  const isValidUrl = (url: string): boolean => {
    const trimmed = url.trim();
    if (trimmed === '') return true;
    return trimmed.startsWith('https://');
  };

  // Open Create Form
  const handleOpenCreateForm = () => {
    setProjectForm({
      ...emptyProjectForm,
      order: projectsList.length + 1,
    });
    setProjectFormError(null);
    setIsEditingProject(true);
  };

  // Open Edit Form
  const handleOpenEditForm = (item: ProjectItem & { published?: boolean }) => {
    setProjectForm({
      id: item.id,
      order: item.order,
      published: item.published ?? true,
      categoryEn: item.category.en,
      categoryAr: item.category.ar,
      titleEn: item.title.en,
      titleAr: item.title.ar,
      descriptionEn: item.description.en,
      descriptionAr: item.description.ar,
      featuresEn: item.features.en.join('\n'),
      featuresAr: item.features.ar.join('\n'),
      tools: item.tools.join(', '),
      imageUrl: item.imageUrl || '',
      liveUrl: item.liveUrl || '',
      caseStudyUrl: item.caseStudyUrl || '',
    });
    setProjectFormError(null);
    setIsEditingProject(true);
  };

  // Save Project (Create or Update)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    // Validate inputs
    if (!projectForm.titleEn.trim() || !projectForm.titleAr.trim()) {
      setProjectFormError(t('admin.err.titleRequired'));
      return;
    }

    if (!isValidUrl(projectForm.imageUrl)) {
      setProjectFormError(t('admin.err.invalidImageUrl'));
      return;
    }
    if (!isValidUrl(projectForm.liveUrl)) {
      setProjectFormError(t('admin.err.invalidLiveUrl'));
      return;
    }
    if (!isValidUrl(projectForm.caseStudyUrl)) {
      setProjectFormError(t('admin.err.invalidCaseStudyUrl'));
      return;
    }

    setProjectSaving(true);
    setProjectFormError(null);

    try {
      const isEditing = Boolean(projectForm.id);
      const docId =
        projectForm.id ||
        projectForm.titleEn
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') ||
        `project-${Date.now()}`;

      const projectRef = doc(db, 'projects', docId);

      const featuresEn = projectForm.featuresEn
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
      const featuresAr = projectForm.featuresAr
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean);
      const tools = projectForm.tools
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let needsCreatedAt = !isEditing;
      if (isEditing) {
        const existingSnap = await getDoc(projectRef);
        if (existingSnap.exists()) {
          const existingData = existingSnap.data();
          if (!existingData?.createdAt) {
            needsCreatedAt = true;
          }
        } else {
          needsCreatedAt = true;
        }
      }

      const rawPayload: Record<string, unknown> = {
        order: Number(projectForm.order) || 1,
        published: Boolean(projectForm.published),
        category: {
          en: projectForm.categoryEn.trim(),
          ar: projectForm.categoryAr.trim(),
        },
        title: {
          en: projectForm.titleEn.trim(),
          ar: projectForm.titleAr.trim(),
        },
        description: {
          en: projectForm.descriptionEn.trim(),
          ar: projectForm.descriptionAr.trim(),
        },
        features: {
          en: featuresEn,
          ar: featuresAr,
        },
        tools: tools,
        imageUrl: (projectForm.imageUrl || '').trim(),
        liveUrl: (projectForm.liveUrl || '').trim(),
        caseStudyUrl: (projectForm.caseStudyUrl || '').trim(),
        updatedAt: serverTimestamp(),
      };

      if (needsCreatedAt) {
        rawPayload.createdAt = serverTimestamp();
      }

      const payload = removeUndefined(rawPayload);

      await setDoc(projectRef, payload, { merge: true });

      showFeedback('success', t('admin.savedSuccessfully'));
      setIsEditingProject(false);
      await fetchAdminProjects();
    } catch (err) {
      setProjectFormError(
        `${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setProjectSaving(false);
    }
  };

  // Delete Project with Confirmation
  const handleDeleteProject = async (projectId: string) => {
    if (!db) return;
    const confirmed = window.confirm(t('admin.deleteConfirm'));
    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'projects', projectId));
      showFeedback('success', t('admin.savedSuccessfully'));
      await fetchAdminProjects();
    } catch (err) {
      showFeedback('error', `${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Reorder Projects (Up / Down)
  const handleReorder = async (index: number, direction: 'up' | 'down') => {
    if (!db) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projectsList.length) return;

    const currentItem = projectsList[index];
    const neighborItem = projectsList[targetIndex];

    try {
      const batch = writeBatch(db);
      const currentRef = doc(db, 'projects', currentItem.id);
      const neighborRef = doc(db, 'projects', neighborItem.id);

      batch.update(currentRef, { order: neighborItem.order, updatedAt: serverTimestamp() });
      batch.update(neighborRef, { order: currentItem.order, updatedAt: serverTimestamp() });

      await batch.commit();
      await fetchAdminProjects();
    } catch (err) {
      showFeedback('error', `${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  // Seed default projects
  const handleSeedDefaults = async () => {
    setIsSeeding(true);
    try {
      const res = await seedDefaultProjects();
      if (res.success) {
        showFeedback('success', t('admin.seedSuccess'));
        await fetchAdminProjects();
      } else {
        showFeedback('error', res.message || t('admin.somethingWentWrong'));
      }
    } catch (err) {
      showFeedback('error', `${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSeeding(false);
    }
  };

  // =========================================================================
  // TAB 2: PROFILE SETTINGS LOGIC
  // =========================================================================
  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    photoUrl: site.profile.photoUrl,
    mostaql: site.profile.links.mostaql,
    khamsat: site.profile.links.khamsat,
    upwork: site.profile.links.upwork,
  });
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [profileSaving, setProfileSaving] = useState<boolean>(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Fetch Profile Settings from Firestore
  const fetchProfileSettings = useCallback(async () => {
    if (!db) return;
    setProfileLoading(true);
    try {
      const docRef = doc(db, 'settings', 'profile');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileForm({
          photoUrl: data.photoUrl || '',
          mostaql: data.links?.mostaql || '',
          khamsat: data.links?.khamsat || '',
          upwork: data.links?.upwork || '',
        });
      }
    } catch (err) {
      showFeedback('error', `${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProfileLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isAuthorizedAdmin && activeTab === 'profile' && db) {
      fetchProfileSettings();
    }
  }, [isAuthorizedAdmin, activeTab, fetchProfileSettings]);

  // Save Profile Settings
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;

    const trimmedPhoto = profileForm.photoUrl.trim();
    if (trimmedPhoto && !trimmedPhoto.startsWith('https://') && !trimmedPhoto.startsWith('/')) {
      setProfileError(t('admin.err.invalidPhotoUrl'));
      return;
    }
    if (!isValidUrl(profileForm.mostaql)) {
      setProfileError(t('admin.err.invalidLiveUrl'));
      return;
    }
    if (!isValidUrl(profileForm.khamsat)) {
      setProfileError(t('admin.err.invalidLiveUrl'));
      return;
    }
    if (!isValidUrl(profileForm.upwork)) {
      setProfileError(t('admin.err.invalidLiveUrl'));
      return;
    }

    setProfileSaving(true);
    setProfileError(null);

    try {
      const docRef = doc(db, 'settings', 'profile');
      let needsCreatedAt = false;
      const existingSnap = await getDoc(docRef);
      if (!existingSnap.exists() || !existingSnap.data()?.createdAt) {
        needsCreatedAt = true;
      }

      const rawPayload: Record<string, unknown> = {
        photoUrl: (profileForm.photoUrl || '').trim(),
        links: {
          mostaql: (profileForm.mostaql || '').trim(),
          khamsat: (profileForm.khamsat || '').trim(),
          upwork: (profileForm.upwork || '').trim(),
        },
        updatedAt: serverTimestamp(),
      };

      if (needsCreatedAt) {
        rawPayload.createdAt = serverTimestamp();
      }

      const payload = removeUndefined(rawPayload);

      await setDoc(docRef, payload, { merge: true });
      showFeedback('success', t('admin.savedSuccessfully'));
    } catch (err) {
      setProfileError(`${t('admin.somethingWentWrong')}: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setProfileSaving(false);
    }
  };

  // =========================================================================
  // RENDER: Loading State
  // =========================================================================
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-navy flex items-center justify-center p-6">
        <div className="p-8 rounded-2xl bg-brand-card border border-brand-border shadow-card flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
          <span className="text-sm font-mono text-brand-muted">{t('admin.verifyingAuth')}</span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Signed Out Screen (Email & Password)
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-navy flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card text-center relative">
          {/* Top Language Toggle in Sign-in Card */}
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              aria-label="Toggle language: EN | عربي"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
              <span>{site.nav.langToggle[lang]}</span>
            </button>
          </div>

          <div className="w-12 h-12 rounded-xl bg-brand-navy text-brand-cyan font-mono font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-brand-sm">
            {isAr ? 'أ' : 'A'}
          </div>
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-muted mb-1">
            {t('admin.brandTitle')}
          </div>
          <h1 className="text-2xl font-bold text-brand-navy mb-2 tracking-tight">{t('admin.signIn')}</h1>
          <p className="text-sm text-brand-muted mb-6 leading-relaxed">
            {t('admin.signInDescription')}
          </p>

          {(!isFirebaseConfigured || !auth) && (
            <div className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-start leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                <svg className="w-4 h-4 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{t('admin.configMissingTitle')}</span>
              </div>
              <p className="text-amber-800">{t('admin.configMissingDesc')}</p>
            </div>
          )}

          {resetMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-start space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('admin.resetSuccessTitle')}</span>
              </div>
              <p className="text-xs text-emerald-700 leading-relaxed">{resetMessage}</p>
            </div>
          )}

          {authError && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-start space-y-1.5">
              <div className="flex items-center gap-1.5 text-red-800 font-semibold text-xs">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span>{t('admin.authErrorTitle')}</span>
              </div>
              <p className="text-xs text-red-700 leading-relaxed">{authError.message}</p>
              {authError.code && (
                <div className="pt-0.5">
                  <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[11px] font-medium" dir="ltr">
                    Firebase Error: {authError.code}
                  </span>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleEmailSignIn} className="space-y-4 text-start">
            <div>
              <label htmlFor="admin-email" className="block text-xs font-semibold text-brand-navy mb-1.5">
                {t('admin.email')}
              </label>
              <input
                id="admin-email"
                type="email"
                name="email"
                autoComplete="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder={t('admin.emailPlaceholder')}
                disabled={isSigningIn || isResettingPassword}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border bg-brand-white text-brand-navy text-sm placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all disabled:opacity-50"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="admin-password" className="block text-xs font-semibold text-brand-navy">
                  {t('admin.password')}
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={isSigningIn || isResettingPassword}
                  className="text-[11px] font-mono text-brand-muted hover:text-brand-navy transition-colors underline disabled:opacity-50 cursor-pointer"
                >
                  {isResettingPassword ? t('admin.sendingLink') : t('admin.forgotPassword')}
                </button>
              </div>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSigningIn || isResettingPassword}
                  className="w-full px-3.5 py-2.5 pe-11 rounded-xl border border-brand-border bg-brand-white text-brand-navy text-sm placeholder:text-brand-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={t('admin.showHidePassword')}
                  className="absolute end-2.5 top-1/2 -translate-y-1/2 p-1 text-brand-muted hover:text-brand-navy transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSigningIn || isResettingPassword || !isFirebaseConfigured || !auth}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-brand-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-brand-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSigningIn ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin" />
                  <span>{t('admin.signingIn')}</span>
                </>
              ) : (
                <span>{t('admin.signIn')}</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-brand-border">
            <Link
              to="/"
              className="text-xs font-mono text-brand-muted hover:text-brand-navy transition-colors inline-flex items-center gap-1.5"
            >
              <span className="rtl:rotate-180">←</span>
              <span>{t('admin.backToSite')}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Access Denied (Signed in with non-admin UID)
  // =========================================================================
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-brand-bg text-brand-navy flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-md bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card text-center">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              aria-label="Toggle language: EN | عربي"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
              <span>{site.nav.langToggle[lang]}</span>
            </button>
          </div>

          <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 font-mono font-bold text-xl flex items-center justify-center mx-auto mb-4">
            !
          </div>
          <div className="text-xs font-mono font-semibold uppercase tracking-wider text-brand-muted mb-1">
            {t('admin.brandTitle')}
          </div>
          <h1 className="text-2xl font-bold text-brand-navy mb-2 tracking-tight">{t('admin.accessDenied')}</h1>
          <p className="text-sm text-brand-muted mb-4 leading-relaxed">
            {t('admin.accessDeniedDesc')}
          </p>

          <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-start space-y-1.5">
            <div className="text-red-800 font-semibold text-xs">{t('admin.permissionError')}</div>
            <p className="text-xs text-red-700 leading-relaxed">
              {t('admin.accessRestricted')}
            </p>
            <div className="pt-0.5 space-y-1">
              <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[11px] font-medium" dir="ltr">
                Firebase Error: auth/access-denied
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full py-2.5 px-4 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-brand-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {t('admin.signOut')}
            </button>
            <Link
              to="/"
              className="w-full py-2.5 px-4 rounded-xl bg-transparent border border-brand-border hover:bg-brand-chip text-brand-navy text-xs font-semibold transition-colors text-center"
            >
              {t('admin.backToSite')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // RENDER: Authorized Admin Dashboard
  // =========================================================================
  return (
    <div className="min-h-screen bg-brand-bg text-brand-navy flex flex-col">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-30 bg-brand-card border-b border-brand-border shadow-brand-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-navy text-brand-cyan font-mono font-bold text-sm flex items-center justify-center shadow-brand-sm">
              {isAr ? 'أ' : 'A'}
            </div>
            <div className="flex flex-col text-start">
              <span className="font-bold text-sm text-brand-navy leading-none">{t('admin.brandTitle')}</span>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[11px] font-mono text-brand-muted leading-none">{t('admin.portalSubtitle')}</span>
                <span className="text-brand-border text-xs leading-none">•</span>
                {activeProjectId ? (
                  <span className="text-[11px] font-mono text-emerald-600 leading-none" dir="ltr">
                    Connected to project: {activeProjectId}
                  </span>
                ) : (
                  <span className="text-[11px] font-mono text-amber-600 font-medium leading-none">
                    Firebase is not configured
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle in dashboard header */}
            <button
              type="button"
              onClick={toggleLang}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan"
              aria-label="Toggle language: EN | عربي"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan" aria-hidden="true" />
              <span>{site.nav.langToggle[lang]}</span>
            </button>

            <div className="hidden sm:flex flex-col text-end">
              <span className="text-xs font-semibold text-brand-navy">{t('admin.roleAdmin')}</span>
              <span className="text-[11px] font-mono text-emerald-600">{t('admin.roleAuthorized')}</span>
            </div>
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              {t('admin.backToSite')}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg border border-brand-border bg-brand-navy text-brand-white hover:bg-brand-navy-dark text-xs font-mono font-semibold transition-colors cursor-pointer"
            >
              {t('admin.signOut')}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toast / Notification Banner */}
        {feedback && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm flex items-center justify-between shadow-brand-sm border ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <span>{feedback.message}</span>
            <button
              type="button"
              onClick={() => setFeedback(null)}
              className="font-bold text-xs ms-4 hover:opacity-75"
            >
              {t('admin.dismiss')}
            </button>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-brand-border pb-4 mb-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab('projects');
              setIsEditingProject(false);
            }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-brand-navy text-brand-white shadow-brand-sm'
                : 'bg-transparent text-brand-muted hover:text-brand-navy hover:bg-brand-chip'
            }`}
          >
            {t('admin.tabProjects')} ({projectsList.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold font-mono transition-all duration-200 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-brand-navy text-brand-white shadow-brand-sm'
                : 'bg-transparent text-brand-muted hover:text-brand-navy hover:bg-brand-chip'
            }`}
          >
            {t('admin.tabProfile')}
          </button>
        </div>

        {/* ================================================================= */}
        {/* TAB 1: PROJECTS                                                   */}
        {/* ================================================================= */}
        {activeTab === 'projects' && (
          <div>
            {!isEditingProject ? (
              <div>
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div className="text-start">
                    <h2 className="text-xl font-bold text-brand-navy">{t('admin.projectsTitle')}</h2>
                    <p className="text-xs text-brand-muted mt-1">
                      {t('admin.projectsSubtitle')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Seed button only visible when collection is empty */}
                    {projectsList.length === 0 && !projectsLoading && (
                      <button
                        type="button"
                        onClick={handleSeedDefaults}
                        disabled={isSeeding}
                        className="px-4 py-2 rounded-lg bg-brand-chip hover:bg-brand-chip-hover text-brand-navy border border-brand-border text-xs font-semibold font-mono transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        {isSeeding ? t('admin.seeding') : t('admin.seedDefaults')}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleOpenCreateForm}
                      className="px-4 py-2 rounded-lg bg-brand-cyan hover:bg-brand-cyan-hover text-brand-navy text-xs font-semibold font-mono transition-colors shadow-brand-sm cursor-pointer"
                    >
                      {t('admin.addNewProject')}
                    </button>
                  </div>
                </div>

                {/* Projects Table / Card List */}
                {projectsLoading ? (
                  <div className="p-12 text-center bg-brand-card rounded-2xl border border-brand-border">
                    <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <span className="text-xs font-mono text-brand-muted">{t('admin.loadingProjects')}</span>
                  </div>
                ) : projectsList.length === 0 ? (
                  <div className="p-12 text-center bg-brand-card rounded-2xl border border-brand-border">
                    <p className="text-sm font-medium text-brand-navy mb-2">{t('admin.noProjectsFound')}</p>
                    <p className="text-xs text-brand-muted mb-6">
                      {t('admin.seedPrompt')}
                    </p>
                    <button
                      type="button"
                      onClick={handleSeedDefaults}
                      disabled={isSeeding}
                      className="px-4 py-2 rounded-lg bg-brand-cyan hover:bg-brand-cyan-hover text-brand-navy text-xs font-semibold font-mono transition-colors shadow-brand-sm cursor-pointer"
                    >
                      {isSeeding ? t('admin.seeding') : t('admin.seedDefaults')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {projectsList.map((project, index) => {
                      const isPublished = (project as ProjectItem & { published?: boolean }).published ?? true;
                      return (
                        <div
                          key={project.id}
                          className="bg-brand-card border border-brand-border rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-brand-sm hover:border-brand-navy/30 transition-all text-start"
                        >
                          {/* Left Info */}
                          <div className="flex items-center gap-4">
                            {/* Order Controls */}
                            <div className="flex flex-col items-center">
                              <button
                                type="button"
                                onClick={() => handleReorder(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-xs text-brand-muted hover:text-brand-navy disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title={t('admin.moveUp')}
                                aria-label={t('admin.moveUp')}
                              >
                                ▲
                              </button>
                              <span className="font-mono text-xs font-bold text-brand-navy">{project.order}</span>
                              <button
                                type="button"
                                onClick={() => handleReorder(index, 'down')}
                                disabled={index === projectsList.length - 1}
                                className="p-1 text-xs text-brand-muted hover:text-brand-navy disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                title={t('admin.moveDown')}
                                aria-label={t('admin.moveDown')}
                              >
                                ▼
                              </button>
                            </div>

                            {/* Title & Category */}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-base text-brand-navy">{isAr ? project.title.ar : project.title.en}</h3>
                                <span className="text-xs text-brand-muted font-mono">
                                  ({isAr ? project.title.en : project.title.ar})
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs text-brand-muted">
                                <span className="font-mono uppercase">{isAr ? project.category.ar : project.category.en}</span>
                                <span aria-hidden="true">·</span>
                                <span>{project.tools.join(', ')}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Controls */}
                          <div className="flex items-center gap-3">
                            {/* Published Badge */}
                            <span
                              className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase ${
                                isPublished
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-brand-chip text-brand-muted border border-brand-border'
                              }`}
                            >
                              {isPublished ? t('admin.published') : t('admin.unpublished')}
                            </span>

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditForm(project)}
                              className="px-3 py-1.5 rounded-lg border border-brand-border bg-brand-chip hover:bg-brand-chip-hover text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer"
                            >
                              {t('admin.edit')}
                            </button>

                            {/* Delete Button */}
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(project.id)}
                              className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold font-mono transition-colors cursor-pointer"
                            >
                              {t('admin.delete')}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* CREATE / EDIT PROJECT FORM */
              <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card text-start">
                <div className="flex items-center justify-between pb-4 border-b border-brand-border mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-brand-navy">
                      {projectForm.id
                        ? `${t('admin.editProject')}: ${isAr ? projectForm.titleAr || projectForm.titleEn : projectForm.titleEn || projectForm.titleAr}`
                        : t('admin.createProject')}
                    </h3>
                    <p className="text-xs text-brand-muted mt-1">
                      {t('admin.bilingualSubtitle')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingProject(false)}
                    className="text-xs font-mono text-brand-muted hover:text-brand-navy p-2 cursor-pointer"
                  >
                    ✕ {t('admin.cancel')}
                  </button>
                </div>

                {projectFormError && (
                  <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                    {projectFormError}
                  </div>
                )}

                <form onSubmit={handleSaveProject} className="space-y-6">
                  {/* Title (EN & AR) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.titleEn')}
                      </label>
                      <input
                        type="text"
                        required
                        dir="ltr"
                        value={projectForm.titleEn}
                        onChange={(e) => setProjectForm({ ...projectForm, titleEn: e.target.value })}
                        placeholder={t('admin.titleEnPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.titleAr')}
                      </label>
                      <input
                        type="text"
                        required
                        dir="rtl"
                        value={projectForm.titleAr}
                        onChange={(e) => setProjectForm({ ...projectForm, titleAr: e.target.value })}
                        placeholder={t('admin.titleArPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  {/* Category (EN & AR) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.categoryEn')}
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={projectForm.categoryEn}
                        onChange={(e) => setProjectForm({ ...projectForm, categoryEn: e.target.value })}
                        placeholder={t('admin.categoryEnPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.categoryAr')}
                      </label>
                      <input
                        type="text"
                        dir="rtl"
                        value={projectForm.categoryAr}
                        onChange={(e) => setProjectForm({ ...projectForm, categoryAr: e.target.value })}
                        placeholder={t('admin.categoryArPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  {/* Description (EN & AR) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.descriptionEn')}
                      </label>
                      <textarea
                        rows={3}
                        dir="ltr"
                        value={projectForm.descriptionEn}
                        onChange={(e) => setProjectForm({ ...projectForm, descriptionEn: e.target.value })}
                        placeholder={t('admin.descEnPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.descriptionAr')}
                      </label>
                      <textarea
                        rows={3}
                        dir="rtl"
                        value={projectForm.descriptionAr}
                        onChange={(e) => setProjectForm({ ...projectForm, descriptionAr: e.target.value })}
                        placeholder={t('admin.descArPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  {/* Features (EN & AR - one per line) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.featuresEn')}
                      </label>
                      <textarea
                        rows={4}
                        dir="ltr"
                        value={projectForm.featuresEn}
                        onChange={(e) => setProjectForm({ ...projectForm, featuresEn: e.target.value })}
                        placeholder={t('admin.featuresEnPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.featuresAr')}
                      </label>
                      <textarea
                        rows={4}
                        dir="rtl"
                        value={projectForm.featuresAr}
                        onChange={(e) => setProjectForm({ ...projectForm, featuresAr: e.target.value })}
                        placeholder={t('admin.featuresArPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  {/* Tools / Tech Stack */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                      {t('admin.tools')}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={projectForm.tools}
                      onChange={(e) => setProjectForm({ ...projectForm, tools: e.target.value })}
                      placeholder={t('admin.toolsPlaceholder')}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                  </div>

                  {/* URLs */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.imageUrl')}
                      </label>
                      <input
                        type="url"
                        dir="ltr"
                        value={projectForm.imageUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                        placeholder={t('admin.imageUrlPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.liveUrl')}
                      </label>
                      <input
                        type="url"
                        dir="ltr"
                        value={projectForm.liveUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, liveUrl: e.target.value })}
                        placeholder={t('admin.liveUrlPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.caseStudyUrl')}
                      </label>
                      <input
                        type="url"
                        dir="ltr"
                        value={projectForm.caseStudyUrl}
                        onChange={(e) => setProjectForm({ ...projectForm, caseStudyUrl: e.target.value })}
                        placeholder={t('admin.caseStudyUrlPlaceholder')}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                      />
                    </div>
                  </div>

                  {/* Order & Published Toggle */}
                  <div className="flex flex-wrap items-center gap-6 pt-2">
                    <div className="w-32">
                      <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                        {t('admin.sortOrder')}
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={projectForm.order}
                        onChange={(e) => setProjectForm({ ...projectForm, order: Number(e.target.value) || 1 })}
                        className="w-full px-3.5 py-2 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-5">
                      <input
                        type="checkbox"
                        id="publishedToggle"
                        checked={projectForm.published}
                        onChange={(e) => setProjectForm({ ...projectForm, published: e.target.checked })}
                        className="w-4 h-4 text-brand-cyan rounded border-brand-border focus:ring-brand-cyan cursor-pointer"
                      />
                      <label htmlFor="publishedToggle" className="text-xs font-mono font-semibold text-brand-navy cursor-pointer">
                        {t('admin.publishedCheckbox')}
                      </label>
                    </div>
                  </div>

                  {/* Submit / Cancel Buttons */}
                  <div className="pt-6 border-t border-brand-border flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingProject(false)}
                      className="px-4 py-2.5 rounded-xl border border-brand-border hover:bg-brand-chip text-brand-navy text-xs font-semibold font-mono transition-colors cursor-pointer"
                    >
                      {t('admin.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={projectSaving}
                      className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-brand-white text-xs font-semibold font-mono transition-colors shadow-brand-sm disabled:opacity-50 cursor-pointer"
                    >
                      {projectSaving ? t('admin.savingProject') : t('admin.saveProject')}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: PROFILE SETTINGS                                           */}
        {/* ================================================================= */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl text-start">
            <div className="bg-brand-card border border-brand-border rounded-2xl p-6 sm:p-8 shadow-card">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-brand-navy">{t('admin.profileTitle')}</h2>
                <p className="text-xs text-brand-muted mt-1">
                  {t('admin.profileSubtitle')}
                </p>
              </div>

              {/* Informative Note: Free Spark Plan Image Handling */}
              <div className="mb-6 p-4 rounded-xl bg-brand-chip border border-brand-border text-xs text-brand-navy flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-brand-navy text-brand-cyan flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                  i
                </span>
                <div className="leading-relaxed">
                  <strong>{t('admin.imageNoteTitle')}</strong> {t('admin.imageNoteDesc')}
                </div>
              </div>

              {profileError && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {profileError}
                </div>
              )}

              {profileLoading ? (
                <div className="p-8 text-center">
                  <div className="w-6 h-6 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <span className="text-xs font-mono text-brand-muted">{t('admin.loadingSettings')}</span>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  {/* Photo URL */}
                  <div>
                    <label className="block text-xs font-mono font-semibold text-brand-navy mb-1.5">
                      {t('admin.photoUrl')}
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={profileForm.photoUrl}
                      onChange={(e) => setProfileForm({ ...profileForm, photoUrl: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                    />
                    <p className="text-[11px] text-brand-muted mt-1">
                      {t('admin.photoUrlHelp')}
                    </p>
                  </div>

                  {/* Profile Links */}
                  <div className="pt-4 border-t border-brand-border">
                    <h3 className="text-sm font-bold text-brand-navy mb-1">{t('admin.linksSectionTitle')}</h3>
                    <p className="text-xs text-brand-muted mb-4">
                      {t('admin.linksSectionSubtitle')}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-brand-navy mb-1">
                          {t('admin.mostaqlLabel')}
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={profileForm.mostaql}
                          onChange={(e) => setProfileForm({ ...profileForm, mostaql: e.target.value })}
                          placeholder="https://mostaql.com/u/username"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-brand-navy mb-1">
                          {t('admin.khamsatLabel')}
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={profileForm.khamsat}
                          onChange={(e) => setProfileForm({ ...profileForm, khamsat: e.target.value })}
                          placeholder="https://khamsat.com/user/username"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-brand-navy mb-1">
                          {t('admin.upworkLabel')}
                        </label>
                        <input
                          type="url"
                          dir="ltr"
                          value={profileForm.upwork}
                          onChange={(e) => setProfileForm({ ...profileForm, upwork: e.target.value })}
                          placeholder="https://www.upwork.com/freelancers/~profile"
                          className="w-full px-3.5 py-2.5 rounded-lg border border-brand-border bg-brand-bg text-brand-navy text-sm font-mono focus:outline-none focus:ring-2 focus:ring-brand-cyan"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-brand-border flex items-center justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navy-dark text-brand-white text-xs font-semibold font-mono transition-colors shadow-brand-sm disabled:opacity-50 cursor-pointer"
                    >
                      {profileSaving ? t('admin.savingProfile') : t('admin.saveProfile')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
