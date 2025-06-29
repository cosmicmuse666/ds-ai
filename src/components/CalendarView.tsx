import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Target, TrendingUp, Clock, Award } from 'lucide-react';
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

    const totalHours = monthDays.reduce((sum, date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = schedule[dateStr];
      return sum + (dayData?.progress.actualHours || 0);
    }, 0);

    return {
      totalDays,
      completedDays,
      averageProgress: Math.round(averageProgress || 0),
      totalHours: Math.round(totalHours * 10) / 10
    };
  }, [currentMonth, schedule, daysInMonth]);

  const statCards = [
    {
      label: 'Month Progress',
      value: `${monthStats.averageProgress}%`,
      icon: TrendingUp,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      label: 'Days Completed',
      value: `${monthStats.completedDays}/${monthStats.totalDays}`,
      icon: Target,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-600 dark:text-green-400'
    },
    {
      label: 'Hours Studied',
      value: `${monthStats.totalHours}h`,
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      textColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      textColor: 'text-purple-600 dark:text-purple-400'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color, bgColor, textColor }) => (
          <div key={label} className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" 
                 style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }} />
            <div className={`relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50 dark:border-gray-700/50 group-hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`${bgColor} p-4 rounded-2xl`}>
                  <Icon className={`h-7 w-7 ${textColor}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Main Calendar */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Your study journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded-2xl p-1">
              <button
                onClick={handlePreviousMonth}
                className="p-3 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-3 rounded-xl hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 hover:scale-105"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center font-semibold text-gray-500 dark:text-gray-400 text-sm">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="h-32"></div>
            ))}
            
            {daysInMonth.map(date => {
              const dayData = getDayData(date);
              const progress = dayData?.progress.completionPercentage || 0;
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`group h-32 rounded-2xl p-3 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    isCurrentMonth 
                      ? 'bg-white/60 dark:bg-gray-700/60 hover:bg-white dark:hover:bg-gray-700 shadow-lg hover:shadow-xl' 
                      : 'bg-gray-50/50 dark:bg-gray-800/50'
                  } ${isTodayDate ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/20' : ''} border border-gray-200/30 dark:border-gray-600/30`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold ${
                        isTodayDate 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : isCurrentMonth 
                            ? 'text-gray-900 dark:text-white' 
                            : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {format(date, 'd')}
                      </span>
                      {dayData && (
                        <div className={`w-3 h-3 rounded-full ${getSubjectColor(dayData.subject)} shadow-lg`} />
                      )}
                    </div>
                    
                    {dayData && (
                      <>
                        <div className="flex-1 mb-3">
                          <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1 truncate">
                            Week {dayData.week}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
                            {dayData.subject}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {dayData.tasks.length} tasks
                          </div>
                        </div>
                        
                        <div className="mt-auto space-y-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                progress === 100 ? 'bg-gradient-to-r from-green-400 to-green-500' :
                                progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                                'bg-gradient-to-r from-red-400 to-red-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-center font-semibold text-gray-600 dark:text-gray-300">
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

          {/* Enhanced Legend */}
          <div className="mt-8 p-6 bg-gray-50/50 dark:bg-gray-700/50 rounded-2xl">
            <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">Subject Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-blue-500 shadow-lg"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Math (Linear Algebra, Calculus)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Stats & Python</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-orange-500 shadow-lg"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">DS & Algorithms</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-purple-500 shadow-lg"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">Machine Learning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg"></div>
                <span className="text-gray-600 dark:text-gray-300 font-medium">AI & DBMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;