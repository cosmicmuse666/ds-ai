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
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl p-12 text-center border border-gray-200/50 dark:border-gray-700/50 max-w-md mx-auto">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-2xl w-fit mx-auto mb-6">
            <BookOpen className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            No Date Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
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
      'Linear Algebra': 'from-blue-500 to-blue-600 text-white',
      'Calculus': 'from-blue-600 to-blue-700 text-white',
      'Probability': 'from-green-500 to-green-600 text-white',
      'Statistics': 'from-green-600 to-green-700 text-white',
      'Python': 'from-green-400 to-green-500 text-white',
      'Data Structures': 'from-orange-500 to-orange-600 text-white',
      'Algorithms': 'from-orange-600 to-orange-700 text-white',
      'Machine Learning': 'from-purple-500 to-purple-600 text-white',
      'AI': 'from-red-500 to-red-600 text-white',
      'DBMS': 'from-red-600 to-red-700 text-white',
      'Review': 'from-gray-500 to-gray-600 text-white',
      'Mock Tests': 'from-gray-600 to-gray-700 text-white'
    };
    return colors[subject] || 'from-gray-500 to-gray-600 text-white';
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {format(selectedDateObj, 'EEEE, MMMM d, yyyy')}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Week {dayData.week} • {dayData.month}</span>
                  </div>
                </div>
              </div>
              {dayData.progress.completionPercentage === 100 && (
                <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-2xl">
                  <Award className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">Day Completed!</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className={`bg-gradient-to-r ${getSubjectColor(dayData.subject)} px-4 py-2 rounded-2xl shadow-lg`}>
                <span className="font-semibold text-sm">{dayData.subject}</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/60 dark:bg-gray-700/60 px-3 py-2 rounded-xl">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Target: {dayData.plannedHours}h</span>
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Daily Progress</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dayData.progress.completionPercentage}%
                </span>
              </div>
              <div className="relative">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className={`h-4 rounded-full transition-all duration-700 ease-out ${
                      dayData.progress.completionPercentage === 100 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-lg shadow-green-500/30' 
                        : dayData.progress.completionPercentage >= 50 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-lg shadow-blue-500/30' 
                          : 'bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg shadow-yellow-500/30'
                    }`}
                    style={{ width: `${dayData.progress.completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Tab Navigation */}
            <nav className="flex space-x-2 bg-white/60 dark:bg-gray-700/60 rounded-2xl p-1.5 backdrop-blur-sm">
              {tabs.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as 'tasks' | 'notes')}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    activeTab === id
                      ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-600/50'
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <Target className="h-6 w-6 mr-3 text-blue-500" />
                  Daily Tasks ({dayData.progress.tasksCompleted}/{dayData.tasks.length})
                </h3>
                <div className="space-y-3">
                  {dayData.tasks.map((task, index) => (
                    <div
                      key={index}
                      className={`group flex items-start space-x-4 p-5 rounded-2xl transition-all duration-300 border ${
                        isTaskCompleted(index)
                          ? 'bg-green-50/50 dark:bg-green-900/20 border-green-200/50 dark:border-green-700/50'
                          : 'bg-white/60 dark:bg-gray-700/60 hover:bg-white dark:hover:bg-gray-700 border-gray-200/50 dark:border-gray-600/50 hover:shadow-lg'
                      }`}
                    >
                      <button
                        onClick={() => handleTaskToggle(index)}
                        className={`mt-1 transition-all duration-200 hover:scale-110 ${
                          isTaskCompleted(index) ? 'text-green-500' : 'text-blue-500 hover:text-blue-600'
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
                            ? 'line-through text-gray-500 dark:text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}>
                          {task}
                        </p>
                      </div>
                      <ChevronRight className={`h-5 w-5 transition-all duration-200 ${
                        isTaskCompleted(index) ? 'text-green-400' : 'text-gray-400 group-hover:text-gray-600'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Enhanced Time Tracking */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-blue-200/50 dark:border-gray-600/50">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-blue-500" />
                    Time Tracking
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Planned Hours:</span>
                      <span className="font-bold text-gray-900 dark:text-white">{dayData.plannedHours}h</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 dark:bg-gray-700/60 rounded-xl">
                      <label htmlFor="actual-hours" className="text-sm font-medium text-gray-600 dark:text-gray-400">
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
                        className="w-24 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold text-center"
                      />
                    </div>
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Efficiency:</span>
                        <span className={`font-bold text-lg ${
                          dayData.progress.actualHours >= dayData.plannedHours 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-yellow-600 dark:text-yellow-400'
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
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-6 border border-purple-200/50 dark:border-gray-600/50">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                    <BookOpen className="h-5 w-5 mr-3 text-purple-500" />
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
                            className="flex items-center space-x-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 cursor-pointer p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 group border border-blue-200/30 dark:border-blue-700/30"
                          >
                            <ExternalLink className="h-4 w-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="flex-1 truncate font-medium">{linkInfo.title}</span>
                            <ChevronRight className="h-4 w-4 text-blue-400 group-hover:translate-x-1 transition-transform" />
                          </a>
                        );
                      }
                      
                      return (
                        <div key={index} className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300 p-3 rounded-xl bg-white/60 dark:bg-gray-700/60 border border-gray-200/30 dark:border-gray-600/30">
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