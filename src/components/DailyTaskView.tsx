import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, BookOpen, Target, MessageSquare, Calendar, Award } from 'lucide-react';
import { format } from 'date-fns';
import { useStudy } from '../context/StudyContext';
import NotesManager from './NotesManager';

const DailyTaskView: React.FC = () => {
  const { schedule, selectedDate, updateDayProgress } = useStudy();
  const [activeTab, setActiveTab] = useState<'tasks' | 'notes'>('tasks');

  if (!selectedDate || !schedule[selectedDate]) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          No Date Selected
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          Select a date from the calendar to view daily tasks and progress.
        </p>
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

  const tabs = [
    { id: 'tasks', label: 'Tasks & Progress', icon: Target },
    { id: 'notes', label: 'Daily Notes', icon: MessageSquare }
  ];

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      'Linear Algebra': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
      'Calculus': 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900',
      'Probability': 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
      'Statistics': 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900',
      'Python': 'text-green-500 dark:text-green-400 bg-green-100 dark:bg-green-900',
      'Data Structures': 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900',
      'Algorithms': 'text-orange-700 dark:text-orange-300 bg-orange-100 dark:bg-orange-900',
      'Machine Learning': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
      'AI': 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900',
      'DBMS': 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900',
      'Review': 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900',
      'Mock Tests': 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900'
    };
    return colors[subject] || 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {format(selectedDateObj, 'EEEE, MMMM d, yyyy')}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Week {dayData.week} • {dayData.month}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 mb-4">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getSubjectColor(dayData.subject)}`}>
            <span className="font-medium text-sm">{dayData.subject}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Target: {dayData.plannedHours}h</span>
          </div>
          {dayData.progress.completionPercentage === 100 && (
            <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
              <Award className="h-4 w-4" />
              <span className="text-sm font-medium">Completed!</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3 mb-6">
          <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-500 ${
                dayData.progress.completionPercentage === 100 
                  ? 'bg-green-500' 
                  : dayData.progress.completionPercentage >= 50 
                    ? 'bg-blue-500' 
                    : 'bg-yellow-500'
              }`}
              style={{ width: `${dayData.progress.completionPercentage}%` }}
            />
          </div>
          <span className="text-lg font-bold text-gray-700 dark:text-gray-300 w-12">
            {dayData.progress.completionPercentage}%
          </span>
        </div>

        <nav className="flex space-x-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'tasks' | 'notes')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === id
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6">
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Daily Tasks ({dayData.progress.tasksCompleted}/{dayData.tasks.length})
              </h3>
              <div className="space-y-3">
                {dayData.tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-600"
                  >
                    <button
                      onClick={() => handleTaskToggle(index)}
                      className="mt-0.5 text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      {isTaskCompleted(index) ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm ${
                        isTaskCompleted(index)
                          ? 'line-through text-gray-500 dark:text-gray-400'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {task}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Time Tracking
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Planned Hours:</span>
                    <span className="font-medium text-gray-900 dark:text-white">{dayData.plannedHours}h</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="actual-hours" className="text-sm text-gray-600 dark:text-gray-400">
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
                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Efficiency:</span>
                      <span className={`font-medium ${
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

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Study Resources
                </h4>
                <div className="space-y-2">
                  {dayData.resources.map((resource, index) => (
                    <div key={index} className="text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer p-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors">
                      📚 {resource}
                    </div>
                  ))}
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
  );
};

export default DailyTaskView;