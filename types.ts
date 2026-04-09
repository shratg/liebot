export enum Page {
  DASHBOARD = 'dashboard',
  DETECTION = 'detection',
  GAME = 'game',
  SETTINGS = 'settings',
  KNOWLEDGE = 'knowledge'
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

export interface AnalysisResult {
  riskScore: number;
  fraudType: string;
  reasoningChain: string[];
  keySuspectWords: string[];
  dimensions: {
    emotional: number;
    monetary: number;
    logic: number;
    identity: number;
  };
  suggestions: string[];
}

export interface FraudCase {
  id: string;
  title: string;
  messages: string[];
}