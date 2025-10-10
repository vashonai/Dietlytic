// Firebase service for storing user nutrition data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getAuth, signInAnonymously, onAuthStateChanged, User } from 'firebase/auth';
import { API_KEYS } from '@/config/apiKeys';

export interface NutritionEntry {
  id?: string;
  foodName: string;
  nutritionData: any;
  imageUri?: string;
  timestamp: Date;
  userId: string;
}

class FirebaseService {
  private app;
  private db;
  private auth;
  private currentUser: User | null = null;

  constructor() {
    this.app = initializeApp(API_KEYS.FIREBASE_CONFIG);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);
    
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      await signInAnonymously(this.auth);
    } catch (error) {
      console.error('Firebase auth error:', error);
    }

    onAuthStateChanged(this.auth, (user) => {
      this.currentUser = user;
    });
  }

  async saveNutritionEntry(entry: Omit<NutritionEntry, 'id' | 'userId' | 'timestamp'>): Promise<string> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const docRef = await addDoc(collection(this.db, 'nutritionEntries'), {
      ...entry,
      userId: this.currentUser.uid,
      timestamp: new Date(),
    });
    
    return docRef.id;
    } catch (error) {
      console.error('Error saving nutrition entry:', error);
      throw new Error('Failed to save nutrition data');
    }
  }

  async getNutritionHistory(limitCount: number = 50): Promise<NutritionEntry[]> {
    if (!this.currentUser) {
      throw new Error('User not authenticated');
    }

    try {
      const q = query(
        collection(this.db, 'nutritionEntries'),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const entries: NutritionEntry[] = [];
      
      querySnapshot.forEach((doc) => {
        entries.push({
          id: doc.id,
          ...doc.data(),
        } as NutritionEntry);
      });
      
      return entries;
    } catch (error) {
      console.error('Error fetching nutrition history:', error);
      throw new Error('Failed to fetch nutrition history');
    }
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export const firebaseService = new FirebaseService();
