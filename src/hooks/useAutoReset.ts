import { useEffect, useCallback, useState } from 'react';
import { useStudy } from '../context/StudyContext';
import { ProgressHistoryEntry, ResetSystemState } from '../types';

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

  const recordProgressHistory = useCallback((
    date: string, 
    dayData: any, 
    streak: number
  ): ProgressHistoryEntry => {
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
      timestamp: new Date().toISOString()
    };
  }, [calculateEfficiency]);

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

      // Reset tasks while preserving all other data
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

      showNotification('success', `Daily tasks reset successfully for ${dateStr}`);
      
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

  const checkAndPerformAutoReset = useCallback(async () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const lastResetCheck = resetSystemState?.lastResetCheck;
    
    // Check if we need to perform auto-reset
    if (!lastResetCheck || lastResetCheck.split('T')[0] !== today) {
      const dayData = schedule[today];
      
      // Only reset if there's data for today and it hasn't been reset today
      if (dayData && dayData.lastResetDate?.split('T')[0] !== today) {
        await resetDailyTasks(today);
      } else {
        // Update last check even if no reset was needed
        updateResetSystemState({
          lastResetCheck: now.toISOString()
        });
      }
    }
  }, [schedule, resetSystemState, resetDailyTasks, updateResetSystemState]);

  // Auto-reset check on component mount and every hour
  useEffect(() => {
    checkAndPerformAutoReset();
    
    const interval = setInterval(checkAndPerformAutoReset, 60 * 60 * 1000); // Check every hour
    
    return () => clearInterval(interval);
  }, [checkAndPerformAutoReset]);

  // Manual reset function for user-triggered resets
  const manualReset = useCallback(async (dateStr?: string) => {
    const targetDate = dateStr || new Date().toISOString().split('T')[0];
    return await resetDailyTasks(targetDate);
  }, [resetDailyTasks]);

  return {
    isResetting,
    resetNotification,
    manualReset,
    checkAndPerformAutoReset,
    dismissNotification: () => setResetNotification(prev => ({ ...prev, show: false }))
  };
};