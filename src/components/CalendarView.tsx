import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Target } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { useStudy } from '../context/StudyContext';
import { subjectColors } from '../data/studySchedule';

const CalendarView: React.FC = () => {
  const { schedule, setSelectedDate, setCurrentView } = useStudy();
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 6, 1)); // July 2025

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setCurrentView('daily');
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => addMonths(prev, 1));
  };

  const getDayData = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule[dateStr];
  };

  const getProgressColor = (progress: number) => {
    if (progress === 0) return 'bg-gray-200 dark:bg-gray-600';
    if (progress < 50) return 'bg-red-200 dark:bg-red-800';
    if (progress < 80) return 'bg-yellow-200 dark:bg-yellow-800';
    return 'bg-green-200 dark:bg-green-800';
  };

  const getSubjectColor = (subject: string) => {
    return subjectColors[subject] || 'bg-gray-500';
  };

  // Calculate month statistics
  const monthStats = React.useMemo(() => {
    const monthDays = daysInMonth.filter(date => {
      const dateStr = date.toISOString().split('T')[0];
      return schedule[dateStr];
    });
    
    const totalDays = monthDays.length;
    const completedDays = monthDays.filter(date => {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = schedule[dateStr];
      return dayData?.progress.completionPercentage === 100;
    }).length;
    
    const averageProgress = monthDays.reduce((sum, date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = schedule[dateStr];
      return sum + (dayData?.progress.completionPercentage || 0);
    }, 0) / totalDays;

    return {
      totalDays,
      completedDays,
      averageProgress: Math.round(averageProgress || 0)
    };
  }, [currentMonth, schedule, daysInMonth]);

  return (
    <div className="space-y-6">
      {/* Month Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Month Progress</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{monthStats.averageProgress}%</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-lg">
              <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Days Completed</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {monthStats.completedDays}/{monthStats.totalDays}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900 p-3 rounded-lg">
              <BookOpen className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Period</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {format(currentMonth, 'MMM yyyy')}
              </p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="mr-2 h-6 w-6" />
            {format(currentMonth, 'MMMM yyyy')}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePreviousMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }).map((_, index) => (
            <div key={`empty-${index}`} className="h-28"></div>
          ))}
          
          {daysInMonth.map(date => {
            const dayData = getDayData(date);
            const progress = dayData?.progress.completionPercentage || 0;
            const isCurrentMonth = isSameMonth(date, currentMonth);
            const isTodayDate = isToday(date);

            return (
              <div
                key={date.toISOString()}
                className={`h-28 border border-gray-200 dark:border-gray-600 rounded-lg p-2 cursor-pointer transition-all hover:shadow-md ${
                  isCurrentMonth 
                    ? 'bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600' 
                    : 'bg-gray-50 dark:bg-gray-800'
                } ${isTodayDate ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleDateClick(date)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-sm font-medium ${
                      isTodayDate 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : isCurrentMonth 
                          ? 'text-gray-900 dark:text-white' 
                          : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {dayData && (
                      <div className={`w-3 h-3 rounded-full ${getSubjectColor(dayData.subject)}`} />
                    )}
                  </div>
                  
                  {dayData && (
                    <>
                      <div className="flex-1 mb-2">
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-200 mb-1 truncate">
                          Week {dayData.week}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-300 truncate">
                          {dayData.subject}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {dayData.tasks.length} tasks
                        </div>
                      </div>
                      
                      <div className="mt-auto">
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5 mb-1">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                              progress === 100 ? 'bg-green-500' :
                              progress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                          {progress}%
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-gray-600 dark:text-gray-300">Math (Linear Algebra, Calculus)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-300">Stats & Python</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-gray-600 dark:text-gray-300">DS & Algorithms</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-gray-600 dark:text-gray-300">Machine Learning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-300">AI & DBMS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;