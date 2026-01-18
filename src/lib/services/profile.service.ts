import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { User } from '@/lib/types/user';
import { COLLECTIONS } from '@/lib/constants';

export const profileService = {
  // Get user profile by UID
  async getUserProfile(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as User;
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },

  // Create or update user profile
  async saveUserProfile(user: Partial<User> & { uid: string }): Promise<void> {
    try {
      const docRef = doc(db, COLLECTIONS.USERS, user.uid);
      const existingDoc = await getDoc(docRef);
      
      const now = Timestamp.now();
      
      if (existingDoc.exists()) {
        // Update existing profile
        await updateDoc(docRef, {
          ...user,
          updatedAt: now,
        });
      } else {
        // Create new profile
        await setDoc(docRef, {
          ...user,
          createdAt: now,
          updatedAt: now,
        });
      }
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  // Upload profile image
  async uploadProfileImage(uid: string, file: File): Promise<string> {
    try {
      const storageRef = ref(storage, `profile-images/${uid}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading profile image:', error);
      throw error;
    }
  },
};
