# KP-Medizin-Trainer: Published Content Integration

## Overview
This document outlines the implementation plan for updating KP-Medizin-Trainer to read published quizzes from KPFG with cost-efficient caching strategies.

## Goals
1. **Reduce Firebase reads by 95%** through intelligent caching
2. **Improve performance** with 7-day cache and progressive loading
3. **Maintain excellent UX** with instant loads and offline support

## Architecture Overview
```
published_quizzes (Firestore) → 7-day Cache (IndexedDB) → Quiz UI
                              ↓
                    Differential Sync (Weekly)
```

## Implementation Steps

### 1. Update QuizSelector.tsx

**Change collection reference from `quizzes` to `published_quizzes`:**

```typescript
// Update line 88 in QuizSelector.tsx
const querySnapshot = await getDocs(collection(db, 'published_quizzes'));

// Update data mapping to handle new structure
const files = querySnapshot.docs.map(doc => {
  const data = doc.data();
  return {
    id: doc.id,
    name: doc.id,
    version: data.version || '1.0',
    metadata: data.metadata || {},
    content: data.content || {
      teil1: { questions: [] },
      teil2: null,
      teil3: null
    },
    publishedAt: data.publishedAt,
    lastModified: data.lastModified,
    selectedQuestion: null
  } as QuizFile;
});
```

### 2. Enhanced Cache Service

**Create new file: `/src/services/smartQuizCacheService.ts`**

```typescript
import { QuizFile } from '@/types/quiz';
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface QuizCacheDB extends DBSchema {
  quizzes: {
    key: string;
    value: {
      quiz: QuizFile;
      cachedAt: number;
      version: string;
    };
  };
  metadata: {
    key: string;
    value: any;
  };
}

class SmartQuizCacheService {
  private db: IDBPDatabase<QuizCacheDB> | null = null;
  private readonly DB_NAME = 'KlinIQaiQuizCache';
  private readonly CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  
  async init() {
    this.db = await openDB<QuizCacheDB>(this.DB_NAME, 1, {
      upgrade(db) {
        db.createObjectStore('quizzes', { keyPath: 'quiz.id' });
        db.createObjectStore('metadata');
      },
    });
  }
  
  async getCachedQuizzes(): Promise<QuizFile[] | null> {
    if (!this.db) await this.init();
    
    const lastSync = await this.db!.get('metadata', 'lastSync');
    if (!lastSync || Date.now() - lastSync > this.CACHE_DURATION) {
      return null; // Cache expired
    }
    
    const cachedData = await this.db!.getAll('quizzes');
    return cachedData.map(item => item.quiz);
  }
  
  async saveQuizzes(quizzes: QuizFile[]) {
    if (!this.db) await this.init();
    
    const tx = this.db!.transaction(['quizzes', 'metadata'], 'readwrite');
    
    // Clear old data
    await tx.objectStore('quizzes').clear();
    
    // Save new data
    for (const quiz of quizzes) {
      await tx.objectStore('quizzes').add({
        quiz,
        cachedAt: Date.now(),
        version: quiz.version
      });
    }
    
    // Update sync timestamp
    await tx.objectStore('metadata').put(Date.now(), 'lastSync');
    await tx.done;
  }
  
  async checkForUpdates(currentQuizzes: QuizFile[]): Promise<string[]> {
    // Returns IDs of quizzes that need updating
    if (!this.db) await this.init();
    
    const updatedIds: string[] = [];
    
    for (const quiz of currentQuizzes) {
      const cached = await this.db!.get('quizzes', quiz.id);
      if (!cached || cached.version !== quiz.version) {
        updatedIds.push(quiz.id);
      }
    }
    
    return updatedIds;
  }
  
  async getDifferentialUpdates(lastSync: number): Promise<QuizFile[]> {
    // Fetch only quizzes modified since lastSync
    const query = query(
      collection(db, 'published_quizzes'),
      where('lastModified', '>', new Date(lastSync))
    );
    
    const snapshot = await getDocs(query);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as QuizFile));
  }
}

export const smartQuizCache = new SmartQuizCacheService();
```

### 3. Progressive Loading Strategy

**Update QuizSelector.tsx to use smart caching:**

```typescript
const fetchQuizFiles = useCallback(async () => {
  if (!user) {
    setLoading(false);
    return;
  }

  try {
    // 1. Try cache first
    const cachedQuizzes = await smartQuizCache.getCachedQuizzes();
    
    if (cachedQuizzes) {
      setQuizzes(cachedQuizzes);
      setLoading(false);
      
      // 2. Check for updates in background
      const lastSync = await smartQuizCache.getLastSync();
      const updates = await smartQuizCache.getDifferentialUpdates(lastSync);
      
      if (updates.length > 0) {
        // Merge updates with cached data
        const updatedQuizzes = [...cachedQuizzes];
        updates.forEach(update => {
          const index = updatedQuizzes.findIndex(q => q.id === update.id);
          if (index >= 0) {
            updatedQuizzes[index] = update;
          } else {
            updatedQuizzes.push(update);
          }
        });
        
        setQuizzes(updatedQuizzes);
        await smartQuizCache.saveQuizzes(updatedQuizzes);
      }
      
      return;
    }
    
    // 3. Full fetch if no cache
    const querySnapshot = await getDocs(collection(db, 'published_quizzes'));
    const quizzes = querySnapshot.docs.map(doc => /* ... */);
    
    setQuizzes(quizzes);
    await smartQuizCache.saveQuizzes(quizzes);
    
  } catch (error) {
    console.error('Error fetching quiz files:', error);
  } finally {
    setLoading(false);
  }
}, [user]);
```

### 4. Metadata-First Loading

**Create lightweight metadata for quiz listing:**

```typescript
interface QuizMetadata {
  id: string;
  title: string;
  state: string;
  examDate: string;
  fach: string;
  questionCount: number;
  difficulty: string;
  lastUpdated: Date;
}

// Load only metadata for listing
const fetchQuizMetadata = async (): Promise<QuizMetadata[]> => {
  const snapshot = await getDocs(
    query(
      collection(db, 'published_quizzes'),
      select('id', 'metadata', 'publishedAt')
    )
  );
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data().metadata,
    lastUpdated: doc.data().publishedAt?.toDate()
  }));
};

// Load full content when selected
const loadQuizContent = async (quizId: string): Promise<QuizFile> => {
  const doc = await getDoc(doc(db, 'published_quizzes', quizId));
  return { id: doc.id, ...doc.data() } as QuizFile;
};
```

### 5. Cost Optimization Features

#### A. Batch Loading
```typescript
// Load multiple quizzes in one query
const loadMultipleQuizzes = async (quizIds: string[]) => {
  const chunks = []; // Firestore 'in' queries limited to 10
  for (let i = 0; i < quizIds.length; i += 10) {
    chunks.push(quizIds.slice(i, i + 10));
  }
  
  const results = await Promise.all(
    chunks.map(chunk =>
      getDocs(
        query(
          collection(db, 'published_quizzes'),
          where(documentId(), 'in', chunk)
        )
      )
    )
  );
  
  return results.flatMap(snapshot => 
    snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  );
};
```

#### B. Smart Prefetching
```typescript
// Prefetch likely next quiz based on user behavior
const prefetchNextQuiz = async (currentQuizId: string) => {
  // Simple strategy: prefetch next quiz in same fach
  const currentQuiz = quizzes.find(q => q.id === currentQuizId);
  if (!currentQuiz) return;
  
  const nextQuiz = quizzes.find(q => 
    q.id !== currentQuizId && 
    q.metadata.fach === currentQuiz.metadata.fach
  );
  
  if (nextQuiz && !smartQuizCache.isCached(nextQuiz.id)) {
    const content = await loadQuizContent(nextQuiz.id);
    await smartQuizCache.saveQuiz(content);
  }
};
```

### 6. Update Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Published quizzes - read only for authenticated users
    match /published_quizzes/{quizId} {
      allow read: if request.auth != null;
      allow write: if false; // Only Cloud Functions can write
    }
    
    // User progress and analytics
    match /user_progress/{userId}/quiz_attempts/{attemptId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
  }
}
```

### 7. Performance Monitoring

```typescript
// Add performance tracking
const trackCachePerformance = {
  cacheHits: 0,
  cacheMisses: 0,
  averageLoadTime: 0,
  
  recordHit() {
    this.cacheHits++;
    this.logMetrics();
  },
  
  recordMiss() {
    this.cacheMisses++;
    this.logMetrics();
  },
  
  logMetrics() {
    if ((this.cacheHits + this.cacheMisses) % 100 === 0) {
      console.log('Cache performance:', {
        hitRate: (this.cacheHits / (this.cacheHits + this.cacheMisses) * 100).toFixed(2) + '%',
        totalRequests: this.cacheHits + this.cacheMisses
      });
    }
  }
};
```

## Migration Plan

### Phase 1: Basic Integration (Week 1)
1. Update QuizSelector to use `published_quizzes`
2. Extend cache duration to 7 days
3. Deploy and test with small user group

### Phase 2: Smart Caching (Week 2)
1. Implement IndexedDB caching
2. Add differential sync
3. Monitor read reduction metrics

### Phase 3: Optimization (Week 3)
1. Implement metadata-first loading
2. Add batch operations
3. Enable smart prefetching

## Cost Analysis

### Before Optimization
- **Daily reads**: 100 users × 50 quizzes = 5,000 reads
- **Monthly**: 150,000 reads
- **Cost**: ~$0.09/month (at $0.06 per 100k reads)

### After Optimization
- **Initial load**: 100 users × 50 metadata = 5,000 reads
- **Daily active (10%)**: 10 users × 5 quizzes = 50 reads
- **Weekly sync**: 100 users × 5 updates = 500 reads
- **Monthly**: ~7,500 reads (95% reduction)
- **Cost**: ~$0.005/month

## Success Metrics

1. **Cache Hit Rate**: Target > 90%
2. **Load Time**: < 100ms for cached content
3. **Firebase Reads**: 95% reduction
4. **User Satisfaction**: No degradation in UX

## Rollback Plan

1. Keep original `quizCacheService` as fallback
2. Feature flag for new caching system
3. Monitor error rates closely
4. One-click revert to old system

## Future Enhancements

1. **Offline Mode**: Full offline support with background sync
2. **Predictive Caching**: ML-based prefetching
3. **CDN Integration**: Static asset caching
4. **Real-time Updates**: WebSocket for instant updates