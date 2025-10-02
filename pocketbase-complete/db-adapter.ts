/**
 * Database Adapter for Firebase → PocketBase Migration
 *
 * This adapter allows seamless switching between Firebase and PocketBase
 * with a single environment variable (VITE_USE_POCKETBASE)
 *
 * Copy this file to your app's src/lib/ directory
 */

import PocketBase, { RecordService } from 'pocketbase';
import type { RecordModel } from 'pocketbase';

// Initialize PocketBase client
const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

// Auto-restore auth from localStorage
if (typeof window !== 'undefined') {
  const authData = localStorage.getItem('pb_auth');
  if (authData) {
    try {
      const { token, model } = JSON.parse(authData);
      pb.authStore.save(token, model);
    } catch (e) {
      console.error('Failed to restore auth:', e);
    }
  }
}

// Database Adapter Interface
interface DatabaseAdapter {
  // Auth methods
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData?: any) => Promise<any>;
  signOut: () => Promise<void>;
  getCurrentUser: () => any;

  // CRUD operations
  create: (collection: string, data: any) => Promise<any>;
  get: (collection: string, id: string) => Promise<any>;
  update: (collection: string, id: string, data: any) => Promise<any>;
  delete: (collection: string, id: string) => Promise<void>;

  // Query operations
  list: (collection: string, options?: QueryOptions) => Promise<any[]>;
  query: (collection: string, filter: string, options?: QueryOptions) => Promise<any[]>;

  // Realtime
  subscribe: (collection: string, callback: (data: any) => void) => () => void;
}

interface QueryOptions {
  filter?: string;
  sort?: string;
  limit?: number;
  expand?: string;
  page?: number;
}

// PocketBase Adapter Implementation
class PocketBaseAdapter implements DatabaseAdapter {
  async signIn(email: string, password: string) {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);

      // Save to localStorage for persistence
      localStorage.setItem('pb_auth', JSON.stringify({
        token: pb.authStore.token,
        model: pb.authStore.model
      }));

      return authData.record;
    } catch (error) {
      console.error('PocketBase signIn error:', error);
      throw error;
    }
  }

  async signUp(email: string, password: string, userData?: any) {
    try {
      const user = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        emailVisibility: true,
        ...userData
      });

      // Auto sign in after signup
      return this.signIn(email, password);
    } catch (error) {
      console.error('PocketBase signUp error:', error);
      throw error;
    }
  }

  async signOut() {
    pb.authStore.clear();
    localStorage.removeItem('pb_auth');
  }

  getCurrentUser() {
    return pb.authStore.model;
  }

  async create(collection: string, data: any) {
    // Auto-add current user reference if authenticated
    if (pb.authStore.model && !data.user) {
      data.user = pb.authStore.model.id;
    }

    // Convert Firebase timestamps to ISO strings
    if (data.createdAt) {
      data.created = new Date(data.createdAt).toISOString();
      delete data.createdAt;
    }

    return await pb.collection(collection).create(data);
  }

  async get(collection: string, id: string) {
    try {
      return await pb.collection(collection).getOne(id);
    } catch (error) {
      console.error(`Failed to get ${collection}/${id}:`, error);
      return null;
    }
  }

  async update(collection: string, id: string, data: any) {
    // Convert Firebase timestamps
    if (data.updatedAt) {
      data.updated = new Date(data.updatedAt).toISOString();
      delete data.updatedAt;
    }

    return await pb.collection(collection).update(id, data);
  }

  async delete(collection: string, id: string) {
    await pb.collection(collection).delete(id);
  }

  async list(collection: string, options: QueryOptions = {}) {
    const {
      filter = '',
      sort = '-created',
      limit = 50,
      expand = '',
      page = 1
    } = options;

    try {
      const result = await pb.collection(collection).getList(page, limit, {
        filter,
        sort,
        expand
      });

      return result.items;
    } catch (error) {
      console.error(`Failed to list ${collection}:`, error);
      return [];
    }
  }

  async query(collection: string, filter: string, options: QueryOptions = {}) {
    return this.list(collection, { ...options, filter });
  }

  subscribe(collection: string, callback: (data: any) => void) {
    // Subscribe to all changes in collection
    const unsubscribe = pb.collection(collection).subscribe('*', (e) => {
      callback({
        type: e.action, // 'create', 'update', 'delete'
        data: e.record,
        id: e.record.id
      });
    });

    // Return unsubscribe function
    return () => {
      unsubscribe();
    };
  }
}

// Firebase Adapter Implementation (fallback)
class FirebaseAdapter implements DatabaseAdapter {
  private firebaseDb: any;
  private firebaseAuth: any;

  constructor() {
    // Lazy load Firebase only when needed
    if (!import.meta.env.VITE_USE_POCKETBASE || import.meta.env.VITE_USE_POCKETBASE === 'false') {
      this.initFirebase();
    }
  }

  private async initFirebase() {
    const { db, auth } = await import('./firebase');
    this.firebaseDb = db;
    this.firebaseAuth = auth;
  }

  async signIn(email: string, password: string) {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    const cred = await signInWithEmailAndPassword(this.firebaseAuth, email, password);
    return cred.user;
  }

  async signUp(email: string, password: string, userData?: any) {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');
    const cred = await createUserWithEmailAndPassword(this.firebaseAuth, email, password);

    if (userData) {
      const { doc, setDoc } = await import('firebase/firestore');
      await setDoc(doc(this.firebaseDb, 'users', cred.user.uid), userData);
    }

    return cred.user;
  }

  async signOut() {
    await this.firebaseAuth.signOut();
  }

  getCurrentUser() {
    return this.firebaseAuth?.currentUser;
  }

  async create(collection: string, data: any) {
    const { collection as fbCollection, addDoc, serverTimestamp } = await import('firebase/firestore');

    const docRef = await addDoc(fbCollection(this.firebaseDb, collection), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    return { id: docRef.id, ...data };
  }

  async get(collection: string, id: string) {
    const { doc, getDoc } = await import('firebase/firestore');
    const snap = await getDoc(doc(this.firebaseDb, collection, id));
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
  }

  async update(collection: string, id: string, data: any) {
    const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore');

    await updateDoc(doc(this.firebaseDb, collection, id), {
      ...data,
      updatedAt: serverTimestamp()
    });

    return { id, ...data };
  }

  async delete(collection: string, id: string) {
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(this.firebaseDb, collection, id));
  }

  async list(collection: string, options: QueryOptions = {}) {
    const {
      collection as fbCollection,
      query,
      where,
      orderBy,
      limit,
      getDocs
    } = await import('firebase/firestore');

    const constraints = [];

    if (options.filter) {
      // Parse filter string (simplified - you may need more complex parsing)
      const [field, op, value] = options.filter.split(' ');
      constraints.push(where(field, op as any, value));
    }

    if (options.sort) {
      const direction = options.sort.startsWith('-') ? 'desc' : 'asc';
      const field = options.sort.replace(/^-/, '');
      constraints.push(orderBy(field, direction));
    }

    if (options.limit) {
      constraints.push(limit(options.limit));
    }

    const q = query(fbCollection(this.firebaseDb, collection), ...constraints);
    const snap = await getDocs(q);

    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async query(collection: string, filter: string, options: QueryOptions = {}) {
    return this.list(collection, { ...options, filter });
  }

  subscribe(collection: string, callback: (data: any) => void) {
    const { collection as fbCollection, onSnapshot } = require('firebase/firestore');

    return onSnapshot(fbCollection(this.firebaseDb, collection), (snap: any) => {
      snap.docChanges().forEach((change: any) => {
        callback({
          type: change.type,
          data: { id: change.doc.id, ...change.doc.data() },
          id: change.doc.id
        });
      });
    });
  }
}

// Export the adapter based on environment variable
const USE_POCKETBASE = import.meta.env.VITE_USE_POCKETBASE === 'true';

export const dbAdapter: DatabaseAdapter = USE_POCKETBASE
  ? new PocketBaseAdapter()
  : new FirebaseAdapter();

// Export convenience methods
export const db = {
  create: (collection: string, data: any) => dbAdapter.create(collection, data),
  get: (collection: string, id: string) => dbAdapter.get(collection, id),
  update: (collection: string, id: string, data: any) => dbAdapter.update(collection, id, data),
  delete: (collection: string, id: string) => dbAdapter.delete(collection, id),
  list: (collection: string, options?: QueryOptions) => dbAdapter.list(collection, options),
  query: (collection: string, filter: string, options?: QueryOptions) => dbAdapter.query(collection, filter, options),
  subscribe: (collection: string, callback: (data: any) => void) => dbAdapter.subscribe(collection, callback)
};

export const auth = {
  signIn: (email: string, password: string) => dbAdapter.signIn(email, password),
  signUp: (email: string, password: string, userData?: any) => dbAdapter.signUp(email, password, userData),
  signOut: () => dbAdapter.signOut(),
  currentUser: () => dbAdapter.getCurrentUser()
};

// Export PocketBase instance for advanced usage
export { pb as pocketbase };

export default dbAdapter;