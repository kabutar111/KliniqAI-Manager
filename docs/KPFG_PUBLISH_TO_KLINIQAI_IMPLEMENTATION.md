# KPFG: Publish to KlinIQai Feature Implementation

## Overview
This document outlines the implementation plan for adding a "Publish to KlinIQai" feature in KPFG, allowing instructors to publish completed exam forms to the KlinIQai student training app.

## Architecture Overview
```
KPFG (Content Creation) → Cloud Function → published_quizzes → KP-Medizin-Trainer (Student App)
```

## Implementation Steps

### 1. Cloud Function: `publishToKlinIQai`

**Location**: `/functions/src/publishToKlinIQai.ts`

```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { generateJSON } from '../../src/utils/jsonGenerator';

export const publishToKlinIQai = functions.https.onCall(async (data, context) => {
  const { formId, formData } = data;
  
  try {
    // 1. Transform form data to optimized structure
    const optimizedData = generateJSON(formData);
    
    // 2. Add publication metadata
    const publishedQuiz = {
      ...optimizedData,
      publishedAt: admin.firestore.FieldValue.serverTimestamp(),
      publishedFrom: 'kpfg',
      publishedBy: context.auth?.uid || 'anonymous',
      version: formData.version || 'v001'
    };
    
    // 3. Write to published_quizzes collection
    await admin.firestore()
      .collection('published_quizzes')
      .doc(formId)
      .set(publishedQuiz);
    
    // 4. Update original form with publication status
    await admin.firestore()
      .collection('forms')
      .doc(formId)
      .update({
        'metadata.publishedToKlinIQai': true,
        'metadata.lastPublished': admin.firestore.FieldValue.serverTimestamp()
      });
    
    return { success: true, message: 'Successfully published to KlinIQai' };
  } catch (error) {
    console.error('Error publishing to KlinIQai:', error);
    return { success: false, error: error.message };
  }
});
```

### 2. UI Enhancement: SavedForms.tsx

**Add these components to the SavedForms page:**

#### A. Import Cloud Function
```typescript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();
const publishToKlinIQai = httpsCallable(functions, 'publishToKlinIQai');
```

#### B. Publish Button Component
```typescript
const PublishButton = ({ form, onPublished }) => {
  const [publishing, setPublishing] = useState(false);
  const isPublished = form.metadata?.publishedToKlinIQai;
  
  const handlePublish = async () => {
    setPublishing(true);
    try {
      const result = await publishToKlinIQai({ 
        formId: form.id, 
        formData: form 
      });
      
      if (result.data.success) {
        onPublished(form.id);
        // Show success message
      }
    } catch (error) {
      // Handle error
    } finally {
      setPublishing(false);
    }
  };
  
  return (
    <Button
      variant={isPublished ? "secondary" : "primary"}
      size="sm"
      onClick={handlePublish}
      disabled={publishing || form.metadata?.isDraft}
    >
      {publishing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isPublished ? (
        <>
          <CheckCircle className="h-4 w-4 mr-1" />
          Published
        </>
      ) : (
        <>
          <Upload className="h-4 w-4 mr-1" />
          Publish to KlinIQai
        </>
      )}
    </Button>
  );
};
```

#### C. Bulk Publish Feature
```typescript
const handleBulkPublish = async () => {
  const completeForms = selectedForms.filter(
    formId => {
      const form = forms.find(f => f.id === formId);
      return form && !form.metadata?.isDraft;
    }
  );
  
  // Publish each form
  for (const formId of completeForms) {
    const form = forms.find(f => f.id === formId);
    await publishToKlinIQai({ formId, formData: form });
  }
};
```

### 3. Data Structure

#### Published Quiz Structure
```typescript
interface PublishedQuiz {
  // Core identification
  id: string;
  version: string;
  
  // Publication metadata
  publishedAt: Timestamp;
  publishedFrom: 'kpfg';
  publishedBy: string;
  lastModified: Timestamp;
  
  // Optimized metadata for listing
  metadata: {
    state: string;
    stadt: string;
    examYear: string;
    examMonth: string;
    fach: string;
    fachgebiet: string;
    thema: string;
    hauptThemen: string;
    schwierigkeit: string;
    questionStats: {
      total: number;
      teil1: number;
      teil3: number;
    };
  };
  
  // Content (optimized structure from generateJSON)
  content: {
    teil1: {
      questions: Question[];
      anamnese?: string;
      untersuchung?: string;
    };
    teil2?: any;
    teil3?: {
      questions: Question[];
      examiners?: any;
    };
  };
}
```

### 4. Firebase Configuration

#### A. Deploy Function
```bash
# In KPFG root directory
cd functions
npm run build
firebase deploy --only functions:publishToKlinIQai
```

#### B. Firestore Indexes
Add to `firestore.indexes.json`:
```json
{
  "indexes": [
    {
      "collectionGroup": "published_quizzes",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "metadata.state", "order": "ASCENDING" },
        { "fieldPath": "metadata.fach", "order": "ASCENDING" },
        { "fieldPath": "publishedAt", "order": "DESCENDING" }
      ]
    }
  ]
}
```

### 5. Security Considerations

Since KPFG is an internal tool with limited access:
- No role validation needed in the function
- Function accepts any authenticated call from KPFG
- Published content is read-only for students

### 6. Future Enhancements

1. **Unpublish Capability**: Add function to remove from published_quizzes
2. **Update Detection**: Auto-detect when source form changes
3. **Batch Publishing**: Optimize for multiple forms at once
4. **Publication History**: Track all publish/unpublish events
5. **Selective Publishing**: Choose which questions to include

## Testing Plan

1. **Unit Tests**: Test data transformation logic
2. **Integration Tests**: Test Firebase function calls
3. **End-to-End**: Test full publish workflow
4. **Performance**: Test with large forms (100+ questions)

## Rollback Plan

If issues arise:
1. Disable function in Firebase Console
2. Hide publish buttons via feature flag
3. Manually remove problematic documents
4. Fix and redeploy

## Success Metrics

- Publication success rate > 99%
- Average publish time < 2 seconds
- Zero data corruption incidents
- Positive user feedback