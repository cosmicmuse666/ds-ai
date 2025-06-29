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
    <div className="min-h-screen bg-white">
      {/* Calendar Container - 24px padding */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              {/* Interactive Elements - 12px padding */}
              <div className="p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide leading-relaxed">{label}</p>
                    <p className="text-xl font-bold text-gray-900 leading-tight">{value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${
                    color === 'purple' ? 'bg-palette-purple/20 text-palette-purple' :
                    color === 'yellow' ? 'bg-palette-yellow/20 text-palette-yellow-dark' :
                    color === 'coral' ? 'bg-palette-coral/20 text-palette-coral-dark' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Calendar Container - Clean white background with subtle shadow */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          
          {/* Header Section - 16px vertical, 20px horizontal padding */}
          <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              {/* 12px gap between header elements */}
              <div className="flex items-center space-x-3">
                <div className="bg-palette-purple/20 p-2.5 rounded-lg border border-palette-purple/30">
                  <Calendar className="h-5 w-5 text-palette-purple" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1 font-medium leading-relaxed">Your Study Schedule</p>
                </div>
              </div>
              
              {/* Interactive Elements - 12px padding, 8px spacing */}
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-200 p-1">
                <button
                  onClick={handlePreviousMonth}
                  className="p-3 rounded-md hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-3 rounded-md hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                >
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Content - 24px padding */}
          <div className="p-6">
            
            {/* Day Names Row - 12px vertical, 16px horizontal padding */}
            <div className="grid grid-cols-7 gap-1 mb-6">
              {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
                <div key={day} className="text-center py-3 px-4 border-b border-gray-200">
                  <div className="text-xs font-bold text-gray-900 uppercase tracking-wider leading-relaxed">{day.slice(0, 3)}</div>
                  <div className="text-xs text-gray-500 mt-1 font-medium leading-relaxed">{day.slice(3)}</div>
                </div>
              ))}
            </div>

            {/* Date Grid - 4px gap between cells, uniform 1:1 aspect ratio */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month start */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square"></div>
              ))}
              
              {/* Calendar Days - 8px padding inside each cell */}
              {daysInMonth.map(date => {
                const dayData = getDayData(date);
                const progress = dayData?.progress.completionPercentage || 0;
                const isCurrentMonth = isSameMonth(date, currentMonth);
                const isTodayDate = isToday(date);
                const subjectColors = dayData ? getSubjectColor(dayData.subject) : null;

                return (
                  <div
                    key={date.toISOString()}
                    className={`aspect-square rounded-md border cursor-pointer transition-all duration-200 hover:shadow-sm ${
                      isCurrentMonth 
                        ? isTodayDate
                          ? 'bg-gray-50 border-gray-300 hover:bg-gray-100' // Today's Date Highlight - light accent color with 2px border
                          : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                    onClick={() => handleDateClick(date)}
                  >
                    {/* 8px padding inside date cell */}
                    <div className="p-2 flex flex-col h-full">
                      
                      {/* Date Number - Center-aligned */}
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-sm font-bold text-center ${
                          isTodayDate 
                            ? 'text-palette-purple' 
                            : isCurrentMonth 
                              ? 'text-gray-900' 
                              : 'text-gray-400'
                        }`}>
                          {format(date, 'd')}
                        </span>
                        {dayData && (
                          <div className={`w-2 h-2 rounded-full border ${
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
                          <div className="flex-1 space-y-1">
                            {/* Week Badge */}
                            <div className="inline-block px-1.5 py-0.5 bg-gray-100 rounded border border-gray-200">
                              <span className="text-xs font-semibold text-gray-700 leading-tight">W{dayData.week}</span>
                            </div>
                            
                            {/* Event Elements - 8px padding, 6px border radius */}
                            <div className={`px-2 py-1 rounded-md border ${subjectColors?.bg} ${subjectColors?.border}`}>
                              <div className={`text-xs font-bold ${subjectColors?.text} truncate leading-tight`}>
                                {dayData.subject.length > 8 ? dayData.subject.substring(0, 8) + '...' : dayData.subject}
                              </div>
                            </div>
                            
                            {/* Task Count - 4px gap between multiple events */}
                            <div className="flex items-center space-x-1 mt-1">
                              <BookOpen className="h-2.5 w-2.5 text-gray-500" />
                              <span className="text-xs text-gray-600 font-medium leading-tight">
                                {dayData.tasks.length}
                              </span>
                            </div>
                          </div>
                          
                          {/* Progress Bar */}
                          <div className="mt-auto space-y-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5 border border-gray-300">
                              <div 
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                  progress === 100 ? 'bg-green-500' :
                                  progress >= 50 ? 'bg-yellow-400' : 
                                  progress > 0 ? 'bg-orange-400' : 'bg-gray-300'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-center">
                              <span className="text-xs font-bold text-gray-700 leading-tight">{progress}%</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend - 24px padding */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center leading-tight">
                <Target className="h-4 w-4 mr-2 text-gray-600" />
                Subject Legend
              </h3>
              
              {/* Interactive Elements - 12px padding */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-palette-purple border border-palette-purple/50"></div>
                  <span className="text-xs font-semibold text-gray-700 leading-relaxed">Mathematics</span>
                  <span className="text-xs text-gray-500 leading-relaxed">(Linear Algebra, Calculus)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-palette-yellow border border-palette-yellow/50"></div>
                  <span className="text-xs font-semibold text-gray-700 leading-relaxed">Statistics & Python</span>
                  <span className="text-xs text-gray-500 leading-relaxed">(Probability, Stats)</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white rounded-md border border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="w-3 h-3 rounded-full bg-palette-coral border border-palette-coral/50"></div>
                  <span className="text-xs font-semibold text-gray-700 leading-relaxed">Computer Science</span>
                  <span className="text-xs text-gray-500 leading-relaxed">(DS, Algorithms, AI)</span>
                </div>
              </div>
              
              {/* Progress Legend - 8px spacing between components */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-bold text-gray-900 mb-3 leading-tight">Progress Indicators</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500 border border-green-600"></div>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed">Completed (100%)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-yellow-500"></div>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed">In Progress</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-gray-300 border border-gray-400"></div>
                    <span className="text-xs font-medium text-gray-700 leading-relaxed">Not Started</span>
                  </div>
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