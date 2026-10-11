import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../lib/firebase';
import { site, ProfileConfig } from '../content/site';

export interface FirestoreProfileDoc {
  photoUrl?: string;
  links?: {
    mostaql?: string;
    khamsat?: string;
    upwork?: string;
  };
  updatedAt?: unknown;
}

export function useProfile(): { profile: ProfileConfig; loading: boolean } {
  const [profile, setProfile] = useState<ProfileConfig>(site.profile);
  const [loading, setLoading] = useState<boolean>(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setProfile(site.profile);
      setLoading(false);
      return;
    }

    let isMounted = true;

    async function fetchProfile() {
      try {
        const docRef = doc(db!, 'settings', 'profile');
        const docSnap = await getDoc(docRef);

        if (!isMounted) return;

        if (docSnap.exists()) {
          const data = docSnap.data() as FirestoreProfileDoc;
          setProfile({
            ...site.profile,
            photoUrl: data.photoUrl ?? site.profile.photoUrl,
            links: {
              mostaql: data.links?.mostaql ?? site.profile.links.mostaql,
              khamsat: data.links?.khamsat ?? site.profile.links.khamsat,
              upwork: data.links?.upwork ?? site.profile.links.upwork,
            },
          });
        } else {
          setProfile(site.profile);
        }
      } catch (err) {
        if (isMounted) {
          setProfile(site.profile);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  return { profile, loading };
}
