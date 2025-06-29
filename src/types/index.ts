export interface DailyNotes {
  conceptsLearned: string;
  difficultiesFaced: string;
  practiceProblems: string;
  resourceFeedback: string;
  tomorrowFocus: string;
  quickNotes: string;
  voiceNotes: VoiceNote[];
  images: string[];
  tags: string[];
}

export interface VoiceNote {
  id: string;
  timestamp: Date;
  duration: number;
  audioBlob: Blob;
  transcription?: string;
  summary?: string;
  isProcessing?: boolean;
}

export interface DailyProgress {
  tasksCompleted: number;
  totalTasks: number;
  actualHours: number;
  completionPercentage: number;
}

export interface StudyDay {
  week: number;
  month: string;
  subject: string;
  tasks: string[];
  resources: string[];
  plannedHours: number;
  weekday: boolean;
  notes: DailyNotes;
  progress: DailyProgress;
  difficulty?: 'easy' | 'medium' | 'hard';
  resourceRatings?: { [key: string]: number };
}

export interface StudySchedule {
  [date: string]: StudyDay;
}

export type SubjectColors = {
  [key: string]: string;
};