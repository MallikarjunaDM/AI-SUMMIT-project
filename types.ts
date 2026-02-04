
export enum Language {
  Tamil = 'Tamil',
  English = 'English',
  Hindi = 'Hindi',
  Malayalam = 'Malayalam',
  Telugu = 'Telugu'
}

export const LanguageLabels: Record<Language, string> = {
  [Language.Tamil]: 'தமிழ் (Tamil)',
  [Language.English]: 'English',
  [Language.Hindi]: 'हिंदी (Hindi)',
  [Language.Malayalam]: 'മലയാളം (Malayalam)',
  [Language.Telugu]: 'తెలుగు (Telugu)'
};

export const LanguageFlags: Record<Language, string> = {
  [Language.Tamil]: '🇮🇳',
  [Language.English]: '🌐',
  [Language.Hindi]: '🇮🇳',
  [Language.Malayalam]: '🇮🇳',
  [Language.Telugu]: '🇮🇳'
};

export enum Classification {
  AI_GENERATED = 'AI_GENERATED',
  HUMAN = 'HUMAN'
}

export interface DetectionResult {
  status: 'success' | 'error';
  language: Language;
  classification: Classification;
  confidenceScore: number;
  explanation: string;
  transcription: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}

export interface TranscriptionResult {
  text: string;
  confidence: number;
}
