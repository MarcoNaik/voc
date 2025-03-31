export type DialogueParticipant = 'agent' | 'customer';

export interface DialogueMetrics {
  tension: number;
  tonality: number;
  relevance: number;
  [key: string]: number; // For dynamic metrics
}

export interface DialogueSegment {
  speaker: DialogueParticipant;
  text: string;
  start_time: number; // in seconds
  end_time: number; // in seconds
  metrics: DialogueMetrics;
}

export interface CallAnalysis {
  segments: DialogueSegment[];
  summary: string;
  key_moments: {
    description: string;
    timestamp: number;
    importance: number;
  }[];
  customer_info: {
    sentiment: string;
    needs: string[];
    satisfaction_level: number;
  };
  agent_info: {
    performance: number;
    strengths: string[];
    improvement_areas: string[];
  };
}

export interface CustomMetric {
  name: string;
  description: string;
}
