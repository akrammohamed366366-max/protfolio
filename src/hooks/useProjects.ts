import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { site, ProjectItem } from '../content/site';

export interface FirestoreProjectDoc {
  id?: string;
  order: number;
  published: boolean;
  category: { en: string; ar: string };
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  features: { en: string[]; ar: string[] };
  tools: string[];
  imageUrl?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  createdAt?: unknown;
  updatedAt?: unknown;
}

export function useProjects(): { projects: ProjectItem[]; loading: boolean } {
  const [projects, setProjects] = useState<ProjectItem[]>(site.projects.items);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setProjects(site.projects.items);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProjects() {
      try {
        const projectsRef = collection(db!, 'projects');
        // Fetch published projects sorted by order
        const q = query(
          projectsRef,
          where('published', '==', true),
          orderBy('order', 'asc')
        );
        const snapshot = await getDocs(q);

        if (!isMounted) return;

        if (snapshot.empty) {
          // Fall back to static projects if collection is empty
          setProjects(site.projects.items);
        } else {
          const loadedProjects: ProjectItem[] = snapshot.docs.map((docSnap) => {
            const data = docSnap.data() as FirestoreProjectDoc;
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
            };
          });
          setProjects(loadedProjects);
        }
      } catch (err) {
        // Fall back gracefully to static content on any error
        if (isMounted) {
          setProjects(site.projects.items);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProjects();

    return () => {
      isMounted = false;
    };
  }, []);

  return { projects, loading };
}
