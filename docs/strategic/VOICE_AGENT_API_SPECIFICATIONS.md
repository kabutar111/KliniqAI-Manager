# Voice Agent API Specifications for KliniqAI Integration
**Date**: July 18, 2025
**Version**: 2.0
**Status**: Updated based on KPCG implementation review

## API Architecture Overview

### Base URL
```
Production: https://voice-api.kliniqai.com
Development: http://localhost:8000
```

### Authentication
- **Method**: JWT tokens from Firebase Auth
- **Headers**: `Authorization: Bearer <firebase-jwt-token>`
- **Validation**: Server-side Firebase token verification

## Current KPCG Implementation Status

### Available Voice Agents
1. **VoiceExamAgent** - Basic voice exam functionality (MVP)
2. **LiveKitVoiceAgent** - Production pipeline with STT-LLM-TTS
3. **VertexAudioExaminer** - Track 1 implementation (Google native)

### Key Differences from Original Spec
- WebSocket infrastructure exists but Speech-to-Text/Text-to-Speech not fully implemented
- Mock implementations for testing available
- LiveKit integration partial (missing realtime module)
- Three different voice tracks instead of unified approach

## Voice Agent Endpoints

### 1. Patient Simulation Agent

#### Start Patient Session
```http
POST /api/v1/voice-agents/patient/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "string",
  "protocolId": "string",
  "patientCase": {
    "symptoms": ["string"],
    "history": "string",
    "demographics": {
      "age": "number",
      "gender": "string"
    }
  }
}

Response:
{
  "sessionId": "string",
  "status": "active",
  "liveKitToken": "string",
  "roomName": "string",
  "patientProfile": {
    "name": "string",
    "symptoms": ["string"],
    "personality": "string"
  }
}
```

#### Patient Interaction
```http
POST /api/v1/voice-agents/patient/interact
Content-Type: application/json

{
  "sessionId": "string",
  "userInput": "string",
  "inputType": "voice|text"
}

Response:
{
  "patientResponse": "string",
  "audioUrl": "string",
  "symptoms": ["string"],
  "diagnosticHints": ["string"]
}
```

### 2. Full Exam Mode Agent

#### Start Exam Session
```http
POST /api/v1/voice-agents/exam/start
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "string",
  "protocolId": "string",
  "examType": "kenntnisprufung|fsp",
  "city": "string",
  "examinerProfile": "string"
}

Response:
{
  "sessionId": "string",
  "status": "active",
  "liveKitToken": "string",
  "roomName": "string",
  "examiner": {
    "name": "string",
    "specialty": "string",
    "style": "string"
  },
  "examStructure": {
    "phases": ["patient_case", "questions", "documentation"],
    "timeLimit": "number"
  }
}
```

#### Exam Interaction
```http
POST /api/v1/voice-agents/exam/interact
Content-Type: application/json

{
  "sessionId": "string",
  "userInput": "string",
  "phase": "patient_case|questions|documentation"
}

Response:
{
  "examinerResponse": "string",
  "audioUrl": "string",
  "currentPhase": "string",
  "score": "number",
  "feedback": "string",
  "nextQuestion": "string"
}
```

### 3. Documentation Analysis Agent

#### Submit Documentation
```http
POST /api/v1/voice-agents/documentation/analyze
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "string",
  "sessionId": "string",
  "documentation": {
    "diagnosis": "string",
    "treatment": "string",
    "notes": "string"
  }
}

Response:
{
  "analysis": {
    "completeness": "number",
    "accuracy": "number",
    "germanLanguage": "number",
    "medicalTerminology": "number"
  },
  "feedback": {
    "strengths": ["string"],
    "improvements": ["string"],
    "suggestions": ["string"]
  },
  "score": "number"
}
```

## Session Management

### Get Session Status
```http
GET /api/v1/voice-agents/session/{sessionId}
Authorization: Bearer <token>

Response:
{
  "sessionId": "string",
  "status": "active|paused|completed",
  "agentType": "patient|exam|documentation",
  "duration": "number",
  "progress": {
    "currentPhase": "string",
    "completedPhases": ["string"],
    "score": "number"
  }
}
```

### End Session
```http
POST /api/v1/voice-agents/session/{sessionId}/end
Authorization: Bearer <token>

Response:
{
  "sessionId": "string",
  "status": "completed",
  "summary": {
    "totalDuration": "number",
    "finalScore": "number",
    "phases": ["string"],
    "feedback": "string"
  }
}
```

## User Management Integration

### Check Voice Agent Access
```http
GET /api/v1/user/voice-access
Authorization: Bearer <token>

Response:
{
  "hasAccess": "boolean",
  "subscription": {
    "status": "active|inactive",
    "tier": "premium|free",
    "expiresAt": "timestamp"
  },
  "usage": {
    "sessionsThisMonth": "number",
    "remainingSessions": "number"
  }
}
```

### User Voice Agent History
```http
GET /api/v1/user/voice-sessions
Authorization: Bearer <token>

Response:
{
  "sessions": [
    {
      "sessionId": "string",
      "agentType": "patient|exam|documentation",
      "date": "timestamp",
      "duration": "number",
      "score": "number",
      "completed": "boolean"
    }
  ],
  "totalSessions": "number",
  "averageScore": "number"
}
```

## WebSocket Events (LiveKit Integration)

### Voice Agent Events
```javascript
// Connection established
{
  "event": "agent_connected",
  "data": {
    "agentType": "patient|exam|documentation",
    "sessionId": "string"
  }
}

// Voice message received
{
  "event": "voice_message",
  "data": {
    "text": "string",
    "audioUrl": "string",
    "timestamp": "number"
  }
}

// Session state change
{
  "event": "session_state_change",
  "data": {
    "previousState": "string",
    "newState": "string",
    "progress": "number"
  }
}
```

## Error Handling

### Standard Error Response
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "string"
  }
}
```

### Error Codes
- `UNAUTHORIZED`: Invalid or expired token
- `INSUFFICIENT_PERMISSIONS`: No voice agent access
- `SESSION_NOT_FOUND`: Invalid session ID
- `VOICE_AGENT_UNAVAILABLE`: Agent service temporarily down
- `RATE_LIMIT_EXCEEDED`: Too many requests

## Integration with KliniqAI App

### Frontend Components Required
- **VoiceAgentLauncher**: Button to start voice sessions
- **VoiceAgentInterface**: Real-time voice interaction UI
- **SessionHistory**: Display past voice sessions
- **SubscriptionGate**: Check premium access before voice features

### Backend Services Required
- **VoiceAgentService**: API calls to voice agents
- **SessionManager**: Track user voice sessions
- **AccessControl**: Verify subscription status
- **WebSocketHandler**: Real-time voice communication

### Firebase Functions Integration
```javascript
// Cloud Function: checkVoiceAccess
exports.checkVoiceAccess = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid;
  const userDoc = await admin.firestore().doc(`users/${uid}`).get();
  const subscription = userDoc.data().subscription;
  
  return {
    hasAccess: subscription?.status === 'active',
    tier: subscription?.tier || 'free'
  };
});
```

## Testing Strategy

### Unit Tests
- API endpoint functionality
- Authentication middleware
- Error handling
- Session management

### Integration Tests
- KliniqAI app → Voice agent communication
- Payment system → Access control
- Firebase auth → Voice agent authorization

### End-to-End Tests
- Complete user journey: registration → payment → voice simulation
- Voice agent interaction flows
- Session persistence and recovery

## Performance Requirements

### Response Times
- API calls: <200ms average
- Voice agent response: <2s average
- Session initialization: <5s

### Scalability
- Support 100 concurrent voice sessions
- Handle 1000 API calls per minute
- 99.9% uptime requirement

---

**Implementation Priority**: High
**Timeline**: Week 1-2 (API design), Week 3-4 (Integration)
**Testing**: Week 5 (End-to-end), Week 6 (Performance)
**Owner**: Suri (Technical Lead)
**Reviewer**: Claire (Project Lead)