export interface DialogueLine {
  id: string; // unique identifier
  speaker: string; // e.g., "Lucía", "Carlos"
  textTemplate: string; // e.g., "Carlos, ¿qué __________ este fin de semana?"
  missingWords: string[]; // array of missing words, e.g., ["harás"] or ["iremos", "comeremos"]
  fullText: string; // e.g., "Carlos, ¿qué harás este fin de semana?"
  translationArm: string; // e.g., "Կառլոս, ի՞նչ կանես այս շաբաթավերջին։"
}

export interface DialogueData {
  id: string;
  title: string;
  titleArm: string;
  ownerName: string; // "Գոռ" (Gor) or "Գայանե" (Gayane)
  targetWords: string[]; // Options list
  lines: DialogueLine[];
}

export interface QuizQuestion {
  id: string;
  armenianText: string;
  correctSpanish: string;
  options: string[]; // 4 multiple choice options
  dialogueRef?: string; // which dialogue it belongs to, if any
}

export interface ScoreRecord {
  player: 'Գոռ' | 'Գայանե';
  score: number;
  total: number;
  date: string;
}
