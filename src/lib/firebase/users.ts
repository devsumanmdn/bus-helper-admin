import { ref, get } from 'firebase/database';
import { db } from './config';

export async function getUserRole(uid: string): Promise<string | null> {
  try {
    const roleRef = ref(db, `users/${uid}/role`);
    const snapshot = await get(roleRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
}
