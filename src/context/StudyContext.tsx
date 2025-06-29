import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { StudySchedule, StudyDay } from '../types';
import { studySchedule as initialSchedule } from '../data/studySchedule';

interface StudyContextType {
  schedule: StudySchedule;
  updateDayProgress: (date: string, progress: Partial<StudyDay>) => void;
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
  currentView: 'calendar' | 'daily' | 'analytics';
  setCurrentView: (view: 'calendar' | 'daily' | 'analytics') => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
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
  
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'calendar' | 'daily' | 'analytics'>('calendar');
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('studyPlannerTheme');
    return (saved as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('gateStudySchedule', JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem('studyPlannerTheme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const updateDayProgress = (date: string, progress: Partial<StudyDay>) => {
    setSchedule(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        ...progress,
        progress: {
          ...prev[date]?.progress,
          ...progress.progress,
          completionPercentage: progress.progress?.tasksCompleted 
            ? Math.round((progress.progress.tasksCompleted / (prev[date]?.progress.totalTasks || 1)) * 100)
            : prev[date]?.progress.completionPercentage || 0
        }
      }
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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
      toggleTheme
    }}>
      {children}
    </StudyContext.Provider>
  );
};