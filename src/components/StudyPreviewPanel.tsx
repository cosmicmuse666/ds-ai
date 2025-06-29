import React, { useState } from 'react';
import { ChevronRight, Clock, CheckCircle2, Circle, Calendar, BookOpen } from 'lucide-react';
import { format, addDays, isToday, isTomorrow, isYesterday } from 'date-fns';
import { useStudy } from '../context/StudyContext';

const StudyPreviewPanel: React.FC = () => {
  const { schedule, setSelectedDate, setCurrentView, updateDayProgress } = useStudy();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  // Generate 7-day rolling timeline starting from today
  const today = new Date();
  const timelineDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      'Linear Algebra': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid',
      'Calculus': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid',
      'Probability': 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      'Statistics': 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      'Python': 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      'Data Structures': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'Algorithms': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'Machine Learning': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid',
      'AI': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'DBMS': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'Review': 'bg-palette-text-muted/20 border-palette-text-muted/40 text-palette-text-muted',
      'Mock Tests': 'bg-palette-text-muted/20 border-palette-text-muted/40 text-palette-text-muted'
    };
    return colorMap[subject] || 'bg-palette-text-muted/20 border-palette-text-muted/40 text-palette-text-muted';
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
  };

  const handleTopicClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setCurrentView('daily');
  };

  const handleQuickComplete = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateStr = date.toISOString().split('T')[0];
    const dayData = schedule[dateStr];
    
    if (dayData) {
      const newCompleted = dayData.progress.completionPercentage === 100 ? 0 : dayData.tasks.length;
      updateDayProgress(dateStr, {
        progress: {
          ...dayData.progress,
          tasksCompleted: newCompleted,
          completionPercentage: Math.round((newCompleted / dayData.tasks.length) * 100)
        }
      });
    }
  };

  const toggleDayExpansion = (dateStr: string) => {
    setExpandedDay(expandedDay === dateStr ? null : dateStr);
  };

  return (
    <div className="w-80 glass-card rounded-2xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-palette-medium-orchid/20 bg-gradient-to-r from-palette-medium-orchid/10 to-palette-yellow/10">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-2 rounded-xl">
            <Calendar className="h-5 w-5 text-palette-primary-black" />
          </div>
          <div>
            <h3 className="font-bold text-palette-text-light">Study Timeline</h3>
            <p className="text-xs text-palette-text-muted">7-day preview</p>
          </div>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-3">
          {timelineDays.map((date) => {
            const dateStr = date.toISOString().split('T')[0];
            const dayData = schedule[dateStr];
            const isExpanded = expandedDay === dateStr;
            
            if (!dayData) {
              return (
                <div key={dateStr} className="p-3 glass-card-light rounded-xl border border-palette-text-muted/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-palette-text-light">
                        {getDateLabel(date)}
                      </p>
                      <p className="text-xs text-palette-text-muted">No study scheduled</p>
                    </div>
                    <div className="w-2 h-2 bg-palette-text-muted/40 rounded-full"></div>
                  </div>
                </div>
              );
            }

            return (
              <div key={dateStr} className="space-y-2">
                {/* Day Header */}
                <div 
                  className={`p-3 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                    isToday(date) 
                      ? 'bg-palette-medium-orchid/10 border-palette-medium-orchid/30 shadow-purple' 
                      : 'glass-card-light border-palette-medium-orchid/20 hover:bg-palette-bg-light'
                  }`}
                  onClick={() => toggleDayExpansion(dateStr)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <p className={`text-sm font-bold ${
                          isToday(date) ? 'text-palette-medium-orchid' : 'text-palette-text-light'
                        }`}>
                          {getDateLabel(date)}
                        </p>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => handleQuickComplete(date, e)}
                            className={`p-1 rounded-full transition-all duration-200 hover:scale-110 ${
                              dayData.progress.completionPercentage === 100
                                ? 'text-palette-yellow hover:text-palette-yellow-bright'
                                : 'text-palette-text-muted hover:text-palette-medium-orchid'
                            }`}
                          >
                            {dayData.progress.completionPercentage === 100 ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              <Circle className="h-4 w-4" />
                            )}
                          </button>
                          <ChevronRight className={`h-4 w-4 text-palette-text-muted transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`} />
                        </div>
                      </div>
                      
                      {/* Subject Badge */}
                      <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold border ${getSubjectColor(dayData.subject)}`}>
                        <BookOpen className="h-3 w-3 mr-1" />
                        {dayData.subject}
                      </div>
                      
                      {/* Quick Stats */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2 text-xs text-palette-text-muted">
                          <Clock className="h-3 w-3" />
                          <span>{dayData.plannedHours}h planned</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-12 bg-palette-bg-darker rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${
                                dayData.progress.completionPercentage === 100 
                                  ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright' 
                                  : dayData.progress.completionPercentage >= 50 
                                    ? 'bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet' 
                                    : 'bg-gradient-to-r from-palette-coral to-palette-coral-light'
                              }`}
                              style={{ width: `${dayData.progress.completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-palette-text-muted">
                            {dayData.progress.completionPercentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="ml-4 space-y-2 animate-fade-in">
                    <div className="p-3 glass-card-light rounded-xl border border-palette-medium-orchid/20">
                      <h5 className="text-xs font-semibold text-palette-text-light mb-2 flex items-center">
                        <span className="w-2 h-2 bg-palette-medium-orchid rounded-full mr-2"></span>
                        Tasks ({dayData.progress.tasksCompleted}/{dayData.tasks.length})
                      </h5>
                      <div className="space-y-1">
                        {dayData.tasks.slice(0, 3).map((task, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              index < dayData.progress.tasksCompleted 
                                ? 'bg-palette-yellow' 
                                : 'bg-palette-text-muted/40'
                            }`} />
                            <span className={`text-xs ${
                              index < dayData.progress.tasksCompleted 
                                ? 'text-palette-text-muted line-through' 
                                : 'text-palette-text-light'
                            }`}>
                              {task.length > 30 ? task.substring(0, 30) + '...' : task}
                            </span>
                          </div>
                        ))}
                        {dayData.tasks.length > 3 && (
                          <p className="text-xs text-palette-text-muted ml-4">
                            +{dayData.tasks.length - 3} more tasks
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={() => handleTopicClick(date)}
                        className="w-full mt-3 btn-primary text-xs py-2 rounded-lg font-semibold transition-all duration-200 hover:scale-105"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-palette-medium-orchid/20 bg-gradient-to-r from-palette-bg-darker/50 to-palette-bg-light/50">
        <div className="flex items-center justify-between text-xs text-palette-text-muted">
          <span>Click to expand details</span>
          <div className="flex items-center space-x-1">
            <Circle className="h-3 w-3" />
            <span>Quick complete</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPreviewPanel;