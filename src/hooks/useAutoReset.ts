import { useCallback, useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { ProgressHistoryEntry } from '../types';

export const useAutoReset = () => {
  const { schedule, updateDayProgress, resetSystemState, updateResetSystemState } = useStudy();
  const [isResetting, setIsResetting] = useState(false);
  const [resetNotification, setResetNotification] = useState<{
    show: boolean;
    type: 'success' | 'error';
    message: string;
  }>({ show: false, type: 'success', message: '' });

  const showNotification = useCallback((type: 'success' | 'error', message: string) => {
    setResetNotification({ show: true, type, message });
    setTimeout(() => {
      setResetNotification(prev => ({ ...prev, show: false }));
    }, 5000);
  }, []);

  const calculateStreak = useCallback((schedule: any, currentDate: string): number => {
    let streak = 0;
    const today = new Date(currentDate);
    
    // Check backwards from yesterday
    for (let i = 1; i <= 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      const dayData = schedule[dateStr];
      if (dayData && dayData.progress.completionPercentage >= 80) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }, []);

  const calculateEfficiency = useCallback((actualHours: number, plannedHours: number): number => {
    if (plannedHours === 0) return 0;
    return Math.round((actualHours / plannedHours) * 100);
  }, []);

  const calculateNotesMetrics = useCallback((notes: any) => {
    const allText = Object.values(notes)
      .filter(value => typeof value === 'string')
      .join(' ');
    
    const wordCount = allText.split(' ').filter(word => word.length > 0).length;
    const tags = notes.tags || [];
    
    let quality: 'light' | 'medium' | 'deep' = 'light';
    if (wordCount > 200) quality = 'deep';
    else if (wordCount > 100) quality = 'medium';
    
    return { wordCount, tags, quality };
  }, []);

  const recordProgressHistory = useCallback((
    date: string, 
    dayData: any, 
    streak: number
  ): ProgressHistoryEntry => {
    const notesMetrics = calculateNotesMetrics(dayData.notes);
    
    return {
      date,
      completionPercentage: dayData.progress.completionPercentage,
      tasksCompleted: dayData.progress.tasksCompleted,
      totalTasks: dayData.progress.totalTasks,
      actualHours: dayData.progress.actualHours,
      plannedHours: dayData.plannedHours,
      subject: dayData.subject,
      streak,
      efficiency: calculateEfficiency(dayData.progress.actualHours, dayData.plannedHours),
      timestamp: new Date().toISOString(),
      notesWordCount: notesMetrics.wordCount,
      notesTags: notesMetrics.tags,
      notesQuality: notesMetrics.quality
    };
  }, [calculateEfficiency, calculateNotesMetrics]);

  const resetDailyTasks = useCallback(async (dateStr: string) => {
    try {
      setIsResetting(true);
      
      const dayData = schedule[dateStr];
      if (!dayData) {
        throw new Error(`No data found for date: ${dateStr}`);
      }

      // Calculate current streak before reset
      const currentStreak = calculateStreak(schedule, dateStr);
      
      // Record progress history before reset
      const progressEntry = recordProgressHistory(dateStr, dayData, currentStreak);
      
      // Create updated progress history
      const updatedProgressHistory = [
        ...(dayData.progressHistory || []),
        progressEntry
      ].slice(-30); // Keep last 30 entries

      // Reset tasks while preserving all other data (including notes)
      const resetProgress = {
        tasksCompleted: 0,
        totalTasks: dayData.tasks.length,
        actualHours: 0,
        completionPercentage: 0
      };

      // Update the day with reset progress and history
      updateDayProgress(dateStr, {
        progress: resetProgress,
        progressHistory: updatedProgressHistory,
        lastResetDate: new Date().toISOString()
      });

      // Update reset system state
      const newResetHistory = [
        ...(resetSystemState?.resetHistory || []),
        {
          date: dateStr,
          status: 'success' as const,
          previousProgress: progressEntry,
          timestamp: new Date().toISOString()
        }
      ].slice(-10); // Keep last 10 reset records

      updateResetSystemState({
        lastResetCheck: new Date().toISOString(),
        currentStreak,
        totalDaysCompleted: (resetSystemState?.totalDaysCompleted || 0) + (progressEntry.completionPercentage === 100 ? 1 : 0),
        lastResetStatus: 'success',
        resetHistory: newResetHistory
      });

      showNotification('success', `Tasks reset successfully! Progress and notes preserved in history.`);
      
      return { success: true, progressEntry };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      
      // Record error in reset history
      const errorResetHistory = [
        ...(resetSystemState?.resetHistory || []),
        {
          date: dateStr,
          status: 'error' as const,
          previousProgress: {} as ProgressHistoryEntry,
          timestamp: new Date().toISOString(),
          errorMessage
        }
      ].slice(-10);

      updateResetSystemState({
        lastResetCheck: new Date().toISOString(),
        lastResetStatus: 'error',
        resetHistory: errorResetHistory
      });

      showNotification('error', `Reset failed: ${errorMessage}`);
      console.error('Reset error:', error);
      
      return { success: false, error: errorMessage };
    } finally {
      setIsResetting(false);
    }
  }, [schedule, updateDayProgress, resetSystemState, updateResetSystemState, calculateStreak, recordProgressHistory, showNotification]);

  // Manual reset function for user-triggered resets only
  const manualReset = useCallback(async (dateStr?: string) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    return await resetDailyTasks(targetDate);
  }, [resetDailyTasks]);

  return {
    isResetting,
    resetNotification,
    manualReset,
    dismissNotification: () => setResetNotification(prev => ({ ...prev, show: false }))
  };
};