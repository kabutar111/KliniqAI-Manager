# Enhancement Dispatcher Test Simulation

## Step 1: Load Input
- Loaded test_input.json
- Found 2 questions in content.teil3.questions

## Step 2: Analyze Complexity

### Question 1: "Was ist GERD?"
- Simple definition request
- No complex indicators
- Complexity score: 0.1
- **Route to**: enhancement-agent-jobcards.md

### Question 2: "Patient bewusstlos, RR 80/40, EKG zeigt VT, Notfallmanagement?"
- Contains: bewusstlos, EKG, Notfall
- Multiple specialists needed
- Complexity score: 0.9
- **Route to**: enhancement-agent-role.md

## Step 3: Create Output Structure

```json
{
  "version": "v001",
  "id": "TEST-PROTOCOL-2025-01-20",
  "state": "Nordrhein-Westfalen",
  "stadt": "Münster",
  "examYear": "25",
  "examMonth": "01",
  "fach": "Innere Medizin",
  "fachgebiet": "Gastroenterologie",
  "thema": "GERD",
  "metadata": {
    "examinerCount": 1,
    "createdAt": "2025-01-20T10:00:00.000Z"
  },
  "content": {
    "teil1": {
      "anamnese": "63-jährige Patientin mit seit 6 Monaten bestehenden retrosternalen Schmerzen und Reflux, morgendlicher Heiserkeit.",
      "untersuchung": "Epigastrale Druckschmerzen"
    },
    "teil2": {
      "inhalt": "Körperliche Untersuchung",
      "schwierigkeit": "mittel"
    },
    "teil3": {
      "id": "teil3-uuid",
      "inhalt": "Vertiefende Fragen",
      "schwierigkeit": "mittel",
      "questions": []
    }
  },
  "enhancement_metadata": {
    "enhanced_at": "2025-01-20T10:30:00.000Z",
    "dispatcher_version": "2.0",
    "routing_decisions": {
      "q1": "jobcards",
      "q2": "full-specialist"
    }
  }
}
```

## Step 4: Process Questions

### For Q1 - Send to jobcards agent:
```json
{
  "current_question": {
    "id": "q1",
    "originalQuestion": "Was ist GERD?",
    "originalAnswer": "",
    "schwierigkeit": "1",
    "tags": ["GERD", "Definition"]
  },
  "protocol_context": {
    "metadata": {"state": "Nordrhein-Westfalen", "stadt": "Münster"},
    "fach": "Innere Medizin",
    "fachgebiet": "Gastroenterologie",
    "teil1": {
      "anamnese": "63-jährige Patientin mit seit 6 Monaten bestehenden retrosternalen Schmerzen und Reflux, morgendlicher Heiserkeit.",
      "untersuchung": "Epigastrale Druckschmerzen"
    }
  },
  "question_context": {
    "previous_question": null,
    "next_question": {"id": "q2", "thema": "GERD"},
    "question_position": "1 of 2"
  },
  "instruction": "Enhance this single question and return ONLY the enhanced question object"
}
```

### For Q2 - Send to full specialist agent:
```json
{
  "current_question": {
    "id": "q2",
    "originalQuestion": "Patient bewusstlos, RR 80/40, EKG zeigt VT, Notfallmanagement?",
    "originalAnswer": "",
    "schwierigkeit": "3",
    "tags": ["Notfall", "VT", "Schock"]
  },
  "protocol_context": {
    "metadata": {"state": "Nordrhein-Westfalen", "stadt": "Münster"},
    "fach": "Innere Medizin",
    "fachgebiet": "Gastroenterologie",
    "teil1": {
      "anamnese": "63-jährige Patientin mit seit 6 Monaten bestehenden retrosternalen Schmerzen und Reflux, morgendlicher Heiserkeit.",
      "untersuchung": "Epigastrale Druckschmerzen"
    }
  },
  "question_context": {
    "previous_question": {"id": "q1", "thema": "GERD"},
    "next_question": null,
    "question_position": "2 of 2"
  },
  "instruction": "Enhance this single question with awareness of surrounding context"
}
```