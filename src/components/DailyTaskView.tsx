import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Target, MessageSquare, Calendar, Award, ExternalLink, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useStudy } from '../context/StudyContext';
import NotesManager from './NotesManager';

const DailyTaskView: React.FC = () => {
  const { schedule, selectedDate, updateDayProgress } = useStudy();
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');

  if (!selectedDate || !schedule[selectedDate]) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="glass-card rounded-3xl shadow-xl p-12 text-center max-w-md mx-auto">
          <div className="bg-gradient-to-r from-palette-purple to-palette-yellow p-4 rounded-2xl w-fit mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-palette-dark" />
          </div>
          <h3 className="text-2xl font-bold text-palette-text-light mb-4">
            No Date Selected
          </h3>
          <p className="text-palette-text-light/70 leading-relaxed">
            Select a date from the calendar to view daily tasks and track your progress.
          </p>
        </div>
      </div>
    );
  }

  const dayData = schedule[selectedDate];
  const selectedDateObj = new Date(selectedDate);

  const handleTaskToggle = (taskIndex: number) => {
    const currentCompleted = dayData.progress.tasksCompleted;
    const newCompleted = dayData.tasks.some((_, index) => 
      index === taskIndex ? !isTaskCompleted(taskIndex) : isTaskCompleted(index)
    ) ? currentCompleted + (isTaskCompleted(taskIndex) ? -1 : 1) : currentCompleted;

    updateDayProgress(selectedDate, {
      progress: {
        ...dayData.progress,
        tasksCompleted: Math.max(0, Math.min(newCompleted, dayData.tasks.length))
      }
    });
  };

  const handleHoursUpdate = (hours: number) => {
    updateDayProgress(selectedDate, {
      progress: {
        ...dayData.progress,
        actualHours: hours
      }
    });
  };

  const isTaskCompleted = (taskIndex: number) => {
    return taskIndex < dayData.progress.tasksCompleted;
  };

  const isClickableLink = (resource: string) => {
    return resource.startsWith('http://') || resource.startsWith('https://');
  };

  const extractLinkInfo = (resource: string) => {
    if (isClickableLink(resource)) {
      const parts = resource.split(' - ');
      if (parts.length > 1) {
        return {
          url: parts[0],
          title: parts.slice(1).join(' - ')
        };
      }
      return {
        url: resource,
        title: 'External Link'
      };
    }
    return null;
  };

  const tabs = [
    { id: 'tasks', label: 'Tasks & Progress', icon: Target },
    { id: 'notes', label: 'Daily Notes', icon: MessageSquare }
  ];

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Linear Algebra': 'from-palette-purple to-palette-purple-dark text-palette-dark',
      'Calculus': 'from-palette-purple to-palette-purple-dark text-palette-dark',
      'Probability': 'from-palette-yellow to-palette-yellow-bright text-palette-dark',
      'Statistics': 'from-palette-yellow to-palette-yellow-bright text-palette-dark',
      'Python': 'from-palette-yellow to-palette-yellow-bright text-palette-dark',
      'Data Structures': 'from-palette-coral to-palette-coral-light text-palette-white',
      'Algorithms': 'from-palette-coral to-palette-coral-light text-palette-white',
      'Machine Learning': 'from-palette-purple to-palette-purple-dark text-palette-dark',
      'AI': 'from-palette-coral to-palette-coral-light text-palette-white',
      'DBMS': 'from-palette-coral to-palette-coral-light text-palette-white',
      'Review': 'from-palette-btn-gray to-palette-btn-gray-dark text-palette-white',
      'Mock Tests': 'from-palette-btn-gray to-palette-btn-gray-dark text-palette-white'
    };
    return colors[subject] || 'from-palette-btn-gray to-palette-btn-gray-dark text-palette-white';
  };

  return (
    <div className="animate-fade-in">
      <div className="glass-card rounded-3xl shadow-xl overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative p-8 bg-gradient-to-r from-palette-dark/50 to-palette-dark-light/50 border-b border-palette-purple/20">
          <div className="absolute inset-0 bg-gradient-to-r from-palette-purple/5 to-palette-yellow/5"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-palette-text-light mb-2">
                  {format(selectedDateObj, 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-palette-text-light/70">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Week {dayData.week} • {dayData.month}</span>
                  </div>
                </div>
              </div>
              {dayData.progress.completionPercentage === 100 && (
                <div className="flex items-center space-x-2 bg-palette-yellow/20 px-4 py-2 rounded-2xl border border-palette-yellow/30">
                  <Award className="h-5 w-5 text-palette-yellow" />
                  <span className="text-sm font-semibold text-palette-yellow">Day Completed!</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className={`bg-gradient-to-r ${getSubjectColor(dayData.subject)} px-4 py-2 rounded-2xl shadow-lg`}>
                <span className="font-semibold text-sm">{dayData.subject}</span>
              </div>
              <div className="flex items-center space-x-2 glass-card-light px-3 py-2 rounded-xl">
                <Clock className="h-4 w-4 text-palette-text-light/70" />
                <span className="text-sm text-palette-text-light/80">Target: {dayData.plannedHours}h</span>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-palette-text-light/80">Daily Progress</span>
                <span className="text-2xl font-bold text-palette-text-light">
                  {dayData.progress.completionPercentage}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-palette-dark rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-4 rounded-full transition-all duration-700 ease-out ${
                      dayData.progress.completionPercentage === 100 
                        ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright shadow-yellow' 
                        : dayData.progress.completionPercentage >= 50 
                          ? 'bg-gradient-to-r from-palette-purple to-palette-purple-dark shadow-purple' 
                          : 'bg-gradient-to-r from-palette-coral to-palette-coral-light shadow-coral'
                    }`}
                    style={{ width: `${dayData.progress.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <nav className="flex space-x-2 glass-card-light rounded-2xl p-1.5 backdrop-blur-sm">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'tasks' | 'notes')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === id
                      ? 'btn-primary shadow-purple'
                      : 'text-palette-text-light/80 hover:bg-palette-purple/20 hover:text-palette-purple'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="p-8">
          {activeTab === 'tasks' && (
            <div className="space-y-8">
              {/* Enhanced Task List */}
              <div>
                <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-palette-purple" />
                  Daily Tasks ({dayData.progress.tasksCompleted}/{dayData.tasks.length})
                </h3>
                <div className="space-y-3">
                  {dayData.tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`group flex items-start space-x-4 p-5 rounded-2xl transition-all duration-300 border ${
                        isTaskCompleted(index)
                          ? 'bg-palette-yellow/10 border-palette-yellow/30'
                          : 'glass-card-light hover:bg-palette-dark-light border-palette-purple/20 hover:shadow-lg'
                      }`}
                    >
                      <button
                        onClick={() => handleTaskToggle(index)}
                        className={`mt-1 transition-all duration-200 hover:scale-110 ${
                          isTaskCompleted(index) ? 'text-palette-yellow' : 'text-palette-purple hover:text-palette-purple-dark'
                        }`}
                      >
                        {isTaskCompleted(index) ? (
                          <CheckCircle2 className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`font-medium ${
                          isTaskCompleted(index)
                            ? 'line-through text-palette-text-light/50'
                            : 'text-palette-text-light'
                        }`}>
                          {task}
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-all duration-200 ${
                        isTaskCompleted(index) ? 'text-palette-yellow/60' : 'text-palette-text-light/40 group-hover:text-palette-text-light/60'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enhanced Time Tracking */}
                <div className="bg-gradient-to-br from-palette-purple/10 to-palette-purple/5 rounded-2xl p-6 border border-palette-purple/20">
                  <h4 className="font-bold text-palette-text-light mb-6 flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-palette-purple" />
                    Time Tracking
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 glass-card-light rounded-xl">
                      <span className="text-sm font-medium text-palette-text-light/70">Planned Hours:</span>
                      <span className="font-bold text-palette-text-light">{dayData.plannedHours}h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 glass-card-light rounded-xl">
                      <label htmlFor="actual-hours" className="text-sm font-medium text-palette-text-light/70">
                        Actual Hours:
                      </label>
                      <input
                        id="actual-hours"
                        type="number"
                        step="0.5"
                        min="0"
                        max="12"
                        value={dayData.progress.actualHours}
                        onChange={(e) => handleHoursUpdate(parseFloat(e.target.value) || 0)}
                        className="w-24 px-3 py-2 text-sm border border-palette-purple/30 rounded-xl bg-palette-dark text-palette-text-light font-semibold text-center focus:ring-2 focus:ring-palette-purple focus:border-transparent"
                      />
                    </div>
                    <div className="pt-4 border-t border-palette-purple/20">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-palette-text-light/70">Efficiency:</span>
                        <span className={`font-bold text-lg ${
                          dayData.progress.actualHours >= dayData.plannedHours 
                            ? 'text-palette-yellow' 
                            : 'text-palette-coral'
                        }`}>
                          {dayData.plannedHours > 0 
                            ? Math.round((dayData.progress.actualHours / dayData.plannedHours) * 100) 
                            : 0}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Study Resources */}
                <div className="bg-gradient-to-br from-palette-coral/10 to-palette-coral/5 rounded-2xl p-6 border border-palette-coral/20">
                  <h4 className="font-bold text-palette-text-light mb-6 flex items-center">
                    <BookOpen className="h-5 w-5 mr-3 text-palette-coral" />
                    Study Resources ({dayData.resources.length})
                  </h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                    {dayData.resources.map((resource, index) => {
                      const linkInfo = extractLinkInfo(resource);
                      
                      if (linkInfo) {
                        return (
                          <a
                            key={index}
                            href={linkInfo.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 text-sm text-palette-coral hover:text-palette-coral-light cursor-pointer p-3 rounded-xl hover:bg-palette-coral/10 transition-all duration-200 group border border-palette-coral/20"
                          >
                            <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="flex-1 truncate font-medium">{linkInfo.title}</span>
                            <ChevronRight className="h-4 w-4 text-palette-coral/60 group-hover:translate-x-1 transition-transform" />
                          </a>
                        );
                      }
                      
                      return (
                        <div key={index} className="flex items-center space-x-3 text-sm text-palette-text-light/80 p-3 rounded-xl glass-card-light border border-palette-purple/20">
                          <span className="text-lg">📚</span>
                          <span className="flex-1 font-medium">{resource}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <NotesManager selectedDate={selectedDate} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DailyTaskView;