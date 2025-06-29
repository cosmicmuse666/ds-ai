import React, { useState } from 'react';
import { TrendingUp, Calendar, Clock, Target, ChevronDown, ChevronUp, Award, BarChart3 } from 'lucide-react';
import { format } from 'date-fns';
import { useStudy } from '../context/StudyContext';
import { ProgressHistoryEntry } from '../types';

const ProgressHistoryPanel: React.FC = () => {
  const { schedule, resetSystemState } = useStudy();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Collect all progress history from all days
  const allProgressHistory = React.useMemo(() => {
    const history: ProgressHistoryEntry[] = [];
    
    Object.entries(schedule).forEach(([date, dayData]) => {
      if (dayData.progressHistory) {
        history.push(...dayData.progressHistory);
      }
    });
    
    return history.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [schedule]);

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 100) return 'text-palette-yellow';
    if (efficiency >= 80) return 'text-palette-medium-orchid';
    if (efficiency >= 60) return 'text-palette-coral';
    return 'text-palette-text-muted';
  };

  const getCompletionColor = (completion: number) => {
    if (completion === 100) return 'text-palette-yellow';
    if (completion >= 80) return 'text-palette-medium-orchid';
    if (completion >= 60) return 'text-palette-coral';
    return 'text-palette-text-muted';
  };

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy');
  };

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'h:mm a');
  };

  if (!resetSystemState || allProgressHistory.length === 0) {
    return (
      <div className="glass-card rounded-2xl shadow-xl p-6">
        <div className="text-center">
          <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-3 rounded-2xl w-fit mx-auto mb-4">
            <BarChart3 className="h-6 w-6 text-palette-primary-black" />
          </div>
          <h3 className="text-lg font-bold text-palette-text-light mb-2">
            Progress History
          </h3>
          <p className="text-palette-text-muted">
            No progress history available yet. Complete some daily tasks to see your progress tracking.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-palette-medium-orchid/20 bg-gradient-to-r from-palette-medium-orchid/10 to-palette-yellow/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-2.5 rounded-xl shadow-lg">
              <TrendingUp className="h-5 w-5 text-palette-primary-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-palette-text-light">Progress History</h3>
              <p className="text-sm text-palette-text-muted">
                {allProgressHistory.length} recorded sessions
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl text-palette-text-light hover:bg-palette-medium-orchid/20 transition-all duration-200"
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="p-6 border-b border-palette-medium-orchid/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 glass-card-light rounded-xl">
            <div className="text-2xl font-bold text-palette-yellow mb-1">
              {resetSystemState.totalDaysCompleted}
            </div>
            <div className="text-xs font-semibold text-palette-text-muted">Days Completed</div>
          </div>
          
          <div className="text-center p-4 glass-card-light rounded-xl">
            <div className="text-2xl font-bold text-palette-medium-orchid mb-1">
              {resetSystemState.currentStreak}
            </div>
            <div className="text-xs font-semibold text-palette-text-muted">Current Streak</div>
          </div>
          
          <div className="text-center p-4 glass-card-light rounded-xl">
            <div className="text-2xl font-bold text-palette-coral mb-1">
              {Math.round(allProgressHistory.reduce((sum, entry) => sum + entry.completionPercentage, 0) / allProgressHistory.length)}%
            </div>
            <div className="text-xs font-semibold text-palette-text-muted">Avg Completion</div>
          </div>
        </div>
      </div>

      {/* History List */}
      {isExpanded && (
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-3">
            {allProgressHistory.slice(0, 20).map((entry, index) => (
              <div
                key={`${entry.date}-${entry.timestamp}`}
                className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  selectedDate === entry.date
                    ? 'bg-palette-medium-orchid/10 border-palette-medium-orchid/30'
                    : 'glass-card-light border-palette-medium-orchid/20 hover:bg-palette-bg-light'
                }`}
                onClick={() => setSelectedDate(selectedDate === entry.date ? null : entry.date)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2 rounded-lg">
                      <Calendar className="h-4 w-4 text-palette-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-palette-text-light text-sm">
                        {formatDate(entry.date)}
                      </p>
                      <p className="text-xs text-palette-text-muted">
                        {entry.subject} • {formatTime(entry.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getCompletionColor(entry.completionPercentage)}`}>
                        {entry.completionPercentage}%
                      </div>
                      <div className="text-xs text-palette-text-muted">Completed</div>
                    </div>
                    
                    {entry.completionPercentage === 100 && (
                      <Award className="h-5 w-5 text-palette-yellow" />
                    )}
                  </div>
                </div>

                {selectedDate === entry.date && (
                  <div className="mt-4 pt-4 border-t border-palette-medium-orchid/20 animate-fade-in">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Target className="h-4 w-4 text-palette-medium-orchid" />
                        <div>
                          <p className="text-palette-text-muted">Tasks</p>
                          <p className="font-semibold text-palette-text-light">
                            {entry.tasksCompleted}/{entry.totalTasks}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-palette-yellow" />
                        <div>
                          <p className="text-palette-text-muted">Hours</p>
                          <p className="font-semibold text-palette-text-light">
                            {entry.actualHours}h / {entry.plannedHours}h
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-palette-coral" />
                        <div>
                          <p className="text-palette-text-muted">Efficiency</p>
                          <p className={`font-semibold ${getEfficiencyColor(entry.efficiency)}`}>
                            {entry.efficiency}%
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-palette-medium-orchid" />
                        <div>
                          <p className="text-palette-text-muted">Streak</p>
                          <p className="font-semibold text-palette-text-light">
                            {entry.streak} days
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {allProgressHistory.length > 20 && (
              <div className="text-center py-4">
                <p className="text-sm text-palette-text-muted">
                  Showing latest 20 entries of {allProgressHistory.length} total
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressHistoryPanel;