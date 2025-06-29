import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Target, TrendingUp, Clock, Award, Circle, CheckCircle2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { useStudy } from '../context/StudyContext';

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
    const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
      'Linear Algebra': { bg: 'bg-palette-purple/20', text: 'text-palette-purple', border: 'border-palette-purple/40' },
      'Calculus': { bg: 'bg-palette-purple/20', text: 'text-palette-purple', border: 'border-palette-purple/40' },
      'Probability': { bg: 'bg-palette-yellow/20', text: 'text-palette-yellow-dark', border: 'border-palette-yellow/40' },
      'Statistics': { bg: 'bg-palette-yellow/20', text: 'text-palette-yellow-dark', border: 'border-palette-yellow/40' },
      'Python': { bg: 'bg-palette-yellow/20', text: 'text-palette-yellow-dark', border: 'border-palette-yellow/40' },
      'Data Structures': { bg: 'bg-palette-coral/20', text: 'text-palette-coral-dark', border: 'border-palette-coral/40' },
      'Algorithms': { bg: 'bg-palette-coral/20', text: 'text-palette-coral-dark', border: 'border-palette-coral/40' },
      'Machine Learning': { bg: 'bg-palette-purple/20', text: 'text-palette-purple', border: 'border-palette-purple/40' },
      'AI': { bg: 'bg-palette-coral/20', text: 'text-palette-coral-dark', border: 'border-palette-coral/40' },
      'DBMS': { bg: 'bg-palette-coral/20', text: 'text-palette-coral-dark', border: 'border-palette-coral/40' },
      'Review': { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' },
      'Mock Tests': { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-400' }
    };
    return colorMap[subject] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
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
      color: 'purple'
    },
    {
      label: 'Days Completed',
      value: `${monthStats.completedDays}/${monthStats.totalDays}`,
      icon: Target,
      color: 'yellow'
    },
    {
      label: 'Hours Studied',
      value: `${monthStats.totalHours}h`,
      icon: Clock,
      color: 'coral'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: Award,
      color: 'purple'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 bg-white min-h-screen">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border-2 border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
              </div>
              <div className={`p-3 rounded-xl ${
                color === 'purple' ? 'bg-palette-purple/20 text-palette-purple' :
                color === 'yellow' ? 'bg-palette-yellow/20 text-palette-yellow-dark' :
                color === 'coral' ? 'bg-palette-coral/20 text-palette-coral-dark' :
                'bg-gray-100 text-gray-600'
              }`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Calendar */}
      <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-gray-50 px-8 py-6 border-b-2 border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-palette-purple/20 p-3 rounded-xl border-2 border-palette-purple/30">
                <Calendar className="h-6 w-6 text-palette-purple" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {format(currentMonth, 'MMMM yyyy')}
                </h1>
                <p className="text-base text-gray-600 mt-1 font-medium">Your Study Schedule</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white rounded-xl border-2 border-gray-200 p-1">
              <button
                onClick={handlePreviousMonth}
                className="p-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-3 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="p-8">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-4 mb-6">
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <div key={day} className="text-center py-4 border-b-2 border-gray-200">
                <div className="text-sm font-bold text-gray-900 uppercase tracking-wider">{day.slice(0, 3)}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{day.slice(3)}</div>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-4">
            {/* Empty cells for days before month start */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="h-32"></div>
            ))}
            
            {/* Calendar Days */}
            {daysInMonth.map(date => {
              const dayData = getDayData(date);
              const progress = dayData?.progress.completionPercentage || 0;
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isTodayDate = isToday(date);
              const subjectColors = dayData ? getSubjectColor(dayData.subject) : null;

              return (
                <div
                  key={date.toISOString()}
                  className={`h-32 rounded-xl border-2 p-4 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    isCurrentMonth 
                      ? isTodayDate
                        ? 'bg-palette-purple/10 border-palette-purple hover:bg-palette-purple/20'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      : 'bg-gray-50 border-gray-100'
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex flex-col h-full">
                    {/* Date Number */}
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-lg font-bold ${
                        isTodayDate 
                          ? 'text-palette-purple' 
                          : isCurrentMonth 
                            ? 'text-gray-900' 
                            : 'text-gray-400'
                      }`}>
                        {format(date, 'd')}
                      </span>
                      {dayData && (
                        <div className={`w-3 h-3 rounded-full border-2 ${
                          progress === 100 
                            ? 'bg-green-500 border-green-600' 
                            : progress > 0 
                              ? 'bg-yellow-400 border-yellow-500'
                              : 'bg-gray-300 border-gray-400'
                        }`} />
                      )}
                    </div>
                    
                    {/* Day Content */}
                    {dayData && (
                      <>
                        <div className="flex-1 space-y-2">
                          {/* Week Badge */}
                          <div className="inline-block px-2 py-1 bg-gray-100 rounded-md border border-gray-200">
                            <span className="text-xs font-semibold text-gray-700">Week {dayData.week}</span>
                          </div>
                          
                          {/* Subject */}
                          <div className={`px-2 py-1 rounded-md border ${subjectColors?.bg} ${subjectColors?.border}`}>
                            <div className={`text-xs font-bold ${subjectColors?.text} truncate`}>
                              {dayData.subject}
                            </div>
                          </div>
                          
                          {/* Task Count */}
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-600 font-medium">
                              {dayData.tasks.length} tasks
                            </span>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="mt-auto space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2 border border-gray-300">
                            <div 
                              className={`h-2 rounded-full transition-all duration-300 ${
                                progress === 100 ? 'bg-green-500' :
                                progress >= 50 ? 'bg-yellow-400' : 
                                progress > 0 ? 'bg-orange-400' : 'bg-gray-300'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-center">
                            <span className="text-xs font-bold text-gray-700">{progress}%</span>
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
          <div className="mt-8 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
              <Target className="h-5 w-5 mr-2 text-gray-600" />
              Subject Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-4 h-4 rounded-full bg-palette-purple border-2 border-palette-purple/50"></div>
                <span className="text-sm font-semibold text-gray-700">Mathematics</span>
                <span className="text-xs text-gray-500">(Linear Algebra, Calculus)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-4 h-4 rounded-full bg-palette-yellow border-2 border-palette-yellow/50"></div>
                <span className="text-sm font-semibold text-gray-700">Statistics & Python</span>
                <span className="text-xs text-gray-500">(Probability, Stats)</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-4 h-4 rounded-full bg-palette-coral border-2 border-palette-coral/50"></div>
                <span className="text-sm font-semibold text-gray-700">Computer Science</span>
                <span className="text-xs text-gray-500">(DS, Algorithms, AI)</span>
              </div>
            </div>
            
            {/* Progress Legend */}
            <div className="mt-6 pt-6 border-t-2 border-gray-200">
              <h4 className="text-base font-bold text-gray-900 mb-3">Progress Indicators</h4>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-green-600"></div>
                  <span className="text-sm font-medium text-gray-700">Completed (100%)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 border-2 border-yellow-500"></div>
                  <span className="text-sm font-medium text-gray-700">In Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-gray-300 border-2 border-gray-400"></div>
                  <span className="text-sm font-medium text-gray-700">Not Started</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;