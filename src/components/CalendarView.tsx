import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { useStudy } from '../context/StudyContext';
import StudyPreviewPanel from './StudyPreviewPanel';

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
    const colorMap: { [key: string]: string } = {
      'Linear Algebra': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40',
      'Calculus': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40',
      'Probability': 'bg-palette-yellow/20 border-palette-yellow/40',
      'Statistics': 'bg-palette-yellow/20 border-palette-yellow/40',
      'Python': 'bg-palette-yellow/20 border-palette-yellow/40',
      'Data Structures': 'bg-palette-coral/20 border-palette-coral/40',
      'Algorithms': 'bg-palette-coral/20 border-palette-coral/40',
      'Machine Learning': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40',
      'AI': 'bg-palette-coral/20 border-palette-coral/40',
      'DBMS': 'bg-palette-coral/20 border-palette-coral/40',
      'Review': 'bg-palette-bg-light/40 border-palette-text-muted/40',
      'Mock Tests': 'bg-palette-bg-light/40 border-palette-text-muted/40'
    };
    return colorMap[subject] || 'bg-palette-bg-light/40 border-palette-text-muted/40';
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
      gradient: 'from-palette-medium-orchid to-palette-light-violet',
      bgColor: 'bg-palette-medium-orchid/10',
      textColor: 'text-palette-medium-orchid'
    },
    {
      label: 'Days Completed',
      value: `${monthStats.completedDays}/${monthStats.totalDays}`,
      icon: Target,
      gradient: 'from-palette-yellow to-palette-yellow-bright',
      bgColor: 'bg-palette-yellow/10',
      textColor: 'text-palette-yellow'
    },
    {
      label: 'Hours Studied',
      value: `${monthStats.totalHours}h`,
      icon: Clock,
      gradient: 'from-palette-coral to-palette-coral-light',
      bgColor: 'bg-palette-coral/10',
      textColor: 'text-palette-coral'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: Award,
      gradient: 'from-palette-medium-orchid to-palette-coral',
      bgColor: 'bg-gradient-to-r from-palette-medium-orchid/10 to-palette-coral/10',
      textColor: 'text-palette-medium-orchid'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map(({ label, value, icon: Icon, gradient, bgColor, textColor }) => (
          <div key={label} className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <div className={`relative glass-card rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group-hover:scale-105 ${bgColor}`}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-palette-text-muted">{label}</p>
                  <p className="text-3xl font-bold text-palette-text-light">{value}</p>
                </div>
                <div className={`bg-gradient-to-r ${gradient} p-4 rounded-2xl shadow-lg`}>
                  <Icon className="h-7 w-7 text-palette-primary-black" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content with Calendar and Preview Panel */}
      <div className="flex gap-8">
        {/* Calendar Container */}
        <div className="flex-1 glass-card rounded-3xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 lg:p-12">
            {/* Header Section with proper spacing */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-3 rounded-2xl shadow-purple">
                  <Calendar className="h-6 w-6 text-palette-primary-black" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-palette-text-light">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <p className="text-palette-text-muted mt-1">Your study journey</p>
                </div>
              </div>
              {/* Navigation controls with proper spacing */}
              <div className="flex items-center space-x-2 glass-card-light rounded-2xl p-1.5">
                <button
                  onClick={handlePreviousMonth}
                  className="p-3 rounded-xl hover:bg-palette-medium-orchid/20 transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeft className="h-5 w-5 text-palette-text-light" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-3 rounded-xl hover:bg-palette-medium-orchid/20 transition-all duration-200 hover:scale-105"
                >
                  <ChevronRight className="h-5 w-5 text-palette-text-light" />
                </button>
              </div>
            </div>

            {/* Clear visual separation with border */}
            <div className="border-t border-palette-medium-orchid/20 mb-8"></div>

            {/* Day Names Header with consistent spacing */}
            <div className="grid grid-cols-7 gap-3 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="py-4 px-4 text-center font-semibold text-palette-text-muted text-sm tracking-wide">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid with optimized spacing */}
            <div className="grid grid-cols-7 gap-3 sm:gap-4">
              {/* Empty cells for month start alignment */}
              {Array.from({ length: monthStart.getDay() }).map((_, index) => (
                <div key={`empty-${index}`} className="aspect-square min-h-[120px] sm:min-h-[140px]"></div>
              ))}
              
              {/* Date cells with consistent sizing and spacing */}
              {daysInMonth.map(date => {
                const dayData = getDayData(date);
                const progress = dayData?.progress.completionPercentage || 0;
                const isCurrentMonth = isSameMonth(date, currentMonth);
                const isTodayDate = isToday(date);

                return (
                  <div
                    key={date.toISOString()}
                    className={`group aspect-square min-h-[120px] sm:min-h-[140px] rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      isCurrentMonth 
                        ? 'glass-card-light hover:bg-palette-bg-light shadow-lg hover:shadow-xl' 
                        : 'bg-palette-bg-darker/30'
                    } ${isTodayDate ? 'ring-2 ring-palette-medium-orchid shadow-purple bg-palette-medium-orchid/5' : ''}`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="flex flex-col h-full">
                      {/* Date number and subject indicator with proper alignment */}
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-sm sm:text-base font-bold ${
                          isTodayDate 
                            ? 'text-palette-medium-orchid' 
                            : isCurrentMonth 
                              ? 'text-palette-text-light' 
                              : 'text-palette-text-muted'
                        }`}>
                          {format(date, 'd')}
                        </span>
                        {dayData && (
                          <div className={`w-3 h-3 rounded-full ${getSubjectColor(dayData.subject).split(' ')[0]} shadow-lg`} />
                        )}
                      </div>
                      
                      {/* Event content with proper spacing */}
                      {dayData && (
                        <>
                          <div className="flex-1 mb-3 space-y-1">
                            <div className="text-xs font-semibold text-palette-text-light truncate">
                              Week {dayData.week}
                            </div>
                            <div className="text-xs text-palette-text-muted truncate font-medium">
                              {dayData.subject}
                            </div>
                            <div className="text-xs text-palette-text-muted">
                              {dayData.tasks.length} tasks
                            </div>
                          </div>
                          
                          {/* Progress indicator with proper spacing */}
                          <div className="mt-auto space-y-2">
                            <div className="w-full bg-palette-bg-darker rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  progress === 100 ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright' :
                                  progress >= 50 ? 'bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet' : 
                                  'bg-gradient-to-r from-palette-coral to-palette-coral-light'
                                }`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-center font-semibold text-palette-text-muted">
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

            {/* Clear visual separation before legend */}
            <div className="border-t border-palette-medium-orchid/20 mt-8 mb-6"></div>

            {/* Enhanced Legend with proper spacing */}
            <div className="p-6 glass-card-light rounded-2xl">
              <h4 className="text-sm font-semibold text-palette-text-light mb-6">Subject Legend</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 text-sm">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-palette-medium-orchid/10 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-palette-medium-orchid shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">Math & ML</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-palette-yellow/10 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-palette-yellow shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">Stats & Python</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-palette-coral/10 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-palette-coral shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">DS & Algorithms</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-palette-medium-orchid/10 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-palette-medium-orchid shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">AI & DBMS</span>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-palette-bg-light/20 transition-colors">
                  <div className="w-4 h-4 rounded-full bg-palette-text-muted shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">Review & Tests</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Study Preview Panel */}
        <div className="hidden lg:block">
          <StudyPreviewPanel />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;