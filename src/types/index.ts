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

export interface ProgressHistoryEntry {
  date: string;
  completionPercentage: number;
  tasksCompleted: number;
  totalTasks: number;
  actualHours: number;
  plannedHours: number;
  subject: string;
  streak: number;
  efficiency: number;
  timestamp: string;
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
  lastResetDate?: string;
  progressHistory?: ProgressHistoryEntry[];
}

export interface StudySchedule {
  [date: string]: StudyDay;
}

export interface ResetSystemState {
  lastResetCheck: string;
  currentStreak: number;
  totalDaysCompleted: number;
  averageCompletionRate: number;
  lastResetStatus: 'success' | 'error' | 'pending' | null;
  resetHistory: Array<{
    date: string;
    status: 'success' | 'error';
    previousProgress: ProgressHistoryEntry;
    timestamp: string;
    errorMessage?: string;
  }>;
}

export type SubjectColors = {
  [key: string]: string;
};