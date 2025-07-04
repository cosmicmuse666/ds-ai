import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudySchedule, StudyDay, ResetSystemState } from '../types';
import { studySchedule as initialSchedule } from '../data/studySchedule';

interface StudyContextType {
  schedule: StudySchedule;
  updateDayProgress: (date: string, progress: Partial<StudyDay>) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  currentView: 'calendar' | 'daily' | 'analytics';
  setCurrentView: (view: 'calendar' | 'daily' | 'analytics') => void;
  theme: 'dark';
  toggleTheme: () => void;
  resetSystemState: ResetSystemState | null;
  updateResetSystemState: (updates: Partial<ResetSystemState>) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

interface StudyProviderProps {
  children: ReactNode;
}

export const StudyProvider: React.FC<StudyProviderProps> = ({ children }) => {
  const [schedule, setSchedule] = useState<StudySchedule>(() => {
    const saved = localStorage.getItem('gateStudySchedule');
    return saved ? JSON.parse(saved) : initialSchedule;
  });
  
  const [resetSystemState, setResetSystemState] = useState<ResetSystemState | null>(() => {
    const saved = localStorage.getItem('gateResetSystemState');
    return saved ? JSON.parse(saved) : {
      lastResetCheck: '',
      currentStreak: 0,
      totalDaysCompleted: 0,
      averageCompletionRate: 0,
      lastResetStatus: null,
      resetHistory: []
    };
  });
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'daily' | 'analytics'>('calendar');
  const [theme] = useState<'dark'>('dark'); // Always dark mode

  useEffect(() => {
    localStorage.setItem('gateStudySchedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    if (resetSystemState) {
      localStorage.setItem('gateResetSystemState', JSON.stringify(resetSystemState));
    }
  }, [resetSystemState]);

  useEffect(() => {
    // Always apply dark theme since our palette is designed for dark mode only
    document.documentElement.classList.add('dark');
    document.body.style.backgroundColor = '#1B1918';
  }, []);

  const updateDayProgress = (date: string, progress: Partial<StudyDay>) => {
    setSchedule(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...progress,
        progress: {
          ...prev[date]?.progress,
          ...progress.progress,
          completionPercentage: progress.progress?.tasksCompleted !== undefined
            ? Math.round((progress.progress.tasksCompleted / (prev[date]?.tasks.length || 1)) * 100)
            : prev[date]?.progress.completionPercentage || 0
        }
      }
    }));
  };

  const updateResetSystemState = (updates: Partial<ResetSystemState>) => {
    setResetSystemState(prev => ({
      ...prev,
      ...updates
    } as ResetSystemState));
  };

  const toggleTheme = () => {
    // Keep dark theme since our palette is designed for it only
    console.log('Theme is locked to dark mode for this design');
  };

  return (
    <StudyContext.Provider value={{
      schedule,
      updateDayProgress,
      selectedDate,
      setSelectedDate,
      currentView,
      setCurrentView,
      theme,
      toggleTheme,
      resetSystemState,
      updateResetSystemState
    }}>
      {children}
    </StudyContext.Provider>
  );
};