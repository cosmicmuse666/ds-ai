import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, BookOpen, Target, TrendingUp, Clock, Award } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns';
import { useStudy } from '../context/StudyContext';
import StudyTimelinePanel from './StudyTimelinePanel';
import TodoListPanel from './TodoListPanel';

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
    <div className="space-y-10 animate-fade-in">
      {/* Top Section - Statistics Cards (Kept Intact) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map(({ label, value, icon: Icon, gradient, bgColor, textColor }) => (
          <div key={label} className="group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl" />
            <div className={`relative glass-card rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 group-hover:scale-105 ${bgColor}`}>
              <div className="flex items-center justify-between">
                <div className="space-y-3">
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

      {/* Calendar Section with Responsive Design */}
      <div className="glass-card rounded-3xl shadow-xl overflow-hidden calendar-main-container">
        <div className="calendar-container">
          {/* Header Section */}
          <div className="calendar-header">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-6 sm:space-y-0">
              <div className="flex items-center space-x-5">
                <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-4 rounded-2xl shadow-purple">
                  <Calendar className="h-7 w-7 text-palette-primary-black" />
                </div>
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-palette-text-light">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <p className="text-palette-text-muted mt-2">Your study journey</p>
                </div>
              </div>
              {/* Navigation controls */}
              <div className="flex items-center space-x-3 glass-card-light rounded-2xl p-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-4 rounded-xl hover:bg-palette-medium-orchid/20 transition-all duration-200 hover:scale-105"
                >
                  <ChevronLeft className="h-6 w-6 text-palette-text-light" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-4 rounded-xl hover:bg-palette-medium-orchid/20 transition-all duration-200 hover:scale-105"
                >
                  <ChevronRight className="h-6 w-6 text-palette-text-light" />
                </button>
              </div>
            </div>
          </div>

          {/* Visual separator */}
          <div className="border-t border-palette-medium-orchid/20 mb-8"></div>

          {/* Day Names Header with Responsive Grid */}
          <div className="calendar-day-names">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}
          </div>

          {/* Responsive Calendar Grid */}
          <div className="calendar-grid">
            {/* Empty cells for month start alignment */}
            {Array.from({ length: monthStart.getDay() }).map((_, index) => (
              <div key={`empty-${index}`} className="calendar-cell"></div>
            ))}
            
            {/* Date cells with responsive design */}
            {daysInMonth.map(date => {
              const dayData = getDayData(date);
              const progress = dayData?.progress.completionPercentage || 0;
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isTodayDate = isToday(date);

              return (
                <div
                  key={date.toISOString()}
                  className={`calendar-cell calendar-cell-enter ${
                    isTodayDate ? 'calendar-cell-today' :
                    isCurrentMonth ? 'calendar-cell-current-month' : 'calendar-cell-other-month'
                  }`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="calendar-cell-content">
                    {/* Date number and subject indicator */}
                    <div className="flex justify-between items-start mb-2">
                      <span className={`calendar-date-number ${
                        isTodayDate 
                          ? 'text-palette-medium-orchid' 
                          : isCurrentMonth 
                            ? 'text-palette-text-light' 
                            : 'text-palette-text-muted'
                      }`}>
                        {format(date, 'd')}
                      </span>
                      {dayData && (
                        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${getSubjectColor(dayData.subject).split(' ')[0]} shadow-lg flex-shrink-0`} />
                      )}
                    </div>
                    
                    {/* Event content */}
                    {dayData && (
                      <>
                        <div className="flex-1 space-y-1 mb-2">
                          <div className="calendar-subject-text text-palette-text-light truncate font-semibold">
                            Week {dayData.week}
                          </div>
                          <div className="calendar-subject-text text-palette-text-muted truncate">
                            {dayData.subject}
                          </div>
                          <div className="calendar-task-count text-palette-text-muted">
                            {dayData.tasks.length} tasks
                          </div>
                        </div>
                        
                        {/* Progress indicator */}
                        <div className="mt-auto space-y-2">
                          <div className="calendar-progress-bar">
                            <div 
                              className={`calendar-progress-fill ${
                                progress === 100 ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright' :
                                progress >= 50 ? 'bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet' : 
                                'bg-gradient-to-r from-palette-coral to-palette-coral-light'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="calendar-progress-text text-palette-text-muted">
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
          <div className="calendar-legend">
            <div className="glass-card-light rounded-3xl p-6 sm:p-8">
              <h4 className="text-base font-semibold text-palette-text-light mb-6 sm:mb-8">Subject Legend</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 text-sm">
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-xl hover:bg-palette-medium-orchid/10 transition-colors">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-palette-medium-orchid shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">Math & ML</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-xl hover:bg-palette-yellow/10 transition-colors">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-palette-yellow shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">Stats & Python</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-xl hover:bg-palette-coral/10 transition-colors">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-palette-coral shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">DS & Algorithms</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-xl hover:bg-palette-medium-orchid/10 transition-colors">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-palette-medium-orchid shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">AI & DBMS</span>
                </div>
                <div className="flex items-center space-x-3 sm:space-x-4 p-3 rounded-xl hover:bg-palette-bg-light/20 transition-colors">
                  <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-palette-text-muted shadow-lg flex-shrink-0"></div>
                  <span className="text-palette-text-muted font-medium">Review & Tests</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Layout Below Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Left Column - Study Timeline */}
        <div className="space-y-6">
          <StudyTimelinePanel />
        </div>

        {/* Right Column - To-Do List */}
        <div className="space-y-6">
          <TodoListPanel />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;