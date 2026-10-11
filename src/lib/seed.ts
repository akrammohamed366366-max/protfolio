import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { site } from '../content/site';

/**
 * Utility to seed default projects and profile settings into Firestore.
 * Call this from the browser console or during initial project onboarding.
 */
export async function seedDefaultProjects(): Promise<{ success: boolean; message: string }> {
  if (!isFirebaseConfigured || !db) {
    return {
      success: false,
      message: 'Firebase is not configured. Please supply environment variables in .env first.',
    };
  }

  try {
    // 1. Seed Projects
    for (const project of site.projects.items) {
      const projectRef = doc(db, 'projects', project.id);
      await setDoc(
        projectRef,
        {
          order: project.order,
          published: true,
          category: project.category,
          title: project.title,
          description: project.description,
          features: project.features,
          tools: project.tools,
          imageUrl: project.imageUrl || '',
          liveUrl: project.liveUrl || '',
          caseStudyUrl: project.caseStudyUrl || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    // 2. Seed Profile Settings
    const profileRef = doc(db, 'settings', 'profile');
    await setDoc(
      profileRef,
      {
        photoUrl: site.profile.photoUrl || '',
        links: {
          mostaql: site.profile.links.mostaql || '',
          khamsat: site.profile.links.khamsat || '',
          upwork: site.profile.links.upwork || '',
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    return {
      success: true,
      message: 'Successfully seeded 2 default projects and profile settings into Firestore.',
    };
  } catch (error) {
    return {
      success: false,
      message: `Error seeding Firestore: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
