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
    const colorMap: { [key: string]: string } = {
      'Linear Algebra': 'bg-palette-purple',
      'Calculus': 'bg-palette-purple',
      'Probability': 'bg-palette-yellow',
      'Statistics': 'bg-palette-yellow',
      'Python': 'bg-palette-yellow',
      'Data Structures': 'bg-palette-coral',
      'Algorithms': 'bg-palette-coral',
      'Machine Learning': 'bg-palette-purple',
      'AI': 'bg-palette-coral',
      'DBMS': 'bg-palette-coral',
      'Review': 'bg-palette-btn-gray',
      'Mock Tests': 'bg-palette-btn-gray-dark'
    };
    return colorMap[subject] || 'bg-palette-btn-gray';
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
      gradient: 'from-palette-purple to-palette-purple-dark',
      bgColor: 'bg-palette-purple/10',
      textColor: 'text-palette-purple'
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
      gradient: 'from-palette-purple to-palette-coral',
      bgColor: 'bg-gradient-to-r from-palette-purple/10 to-palette-coral/10',
      textColor: 'text-palette-purple'
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
                  <p className="text-sm font-medium text-palette-text-light/70">{label}</p>
                  <p className="text-3xl font-bold text-palette-text-light">{value}</p>
                </div>
                <div className={`bg-gradient-to-r ${gradient} p-4 rounded-2xl shadow-lg`}>
                  <Icon className="h-7 w-7 text-palette-dark" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Main Calendar */}
      <div className="glass-card rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-palette-purple to-palette-yellow p-3 rounded-2xl shadow-purple">
                <Calendar className="h-6 w-6 text-palette-dark" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-palette-text-light">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <p className="text-palette-text-light/70 mt-1">Your study journey</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 glass-card-light rounded-2xl p-1">
              <button
                onClick={handlePreviousMonth}
                className="p-3 rounded-xl hover:bg-palette-purple/20 transition-all duration-200 hover:scale-105"
              >
                <ChevronLeft className="h-5 w-5 text-palette-text-light/80" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-3 rounded-xl hover:bg-palette-purple/20 transition-all duration-200 hover:scale-105"
              >
                <ChevronRight className="h-5 w-5 text-palette-text-light/80" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-6">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-4 text-center font-semibold text-palette-text-light/70 text-sm">
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
                      ? 'glass-card-light hover:bg-palette-dark-light shadow-lg hover:shadow-xl' 
                      : 'bg-palette-dark/30'
                  } ${isTodayDate ? 'ring-2 ring-palette-purple shadow-purple' : ''}`}
                  onClick={() => handleDateClick(date)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-sm font-bold ${
                        isTodayDate 
                          ? 'text-palette-purple' 
                          : isCurrentMonth 
                            ? 'text-palette-text-light' 
                            : 'text-palette-text-light/40'
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
                          <div className="text-xs font-semibold text-palette-text-light mb-1 truncate">
                            Week {dayData.week}
                          </div>
                          <div className="text-xs text-palette-text-light/80 truncate font-medium">
                            {dayData.subject}
                          </div>
                          <div className="text-xs text-palette-text-light/60 mt-1">
                            {dayData.tasks.length} tasks
                          </div>
                        </div>
                        
                        <div className="mt-auto space-y-2">
                          <div className="w-full bg-palette-dark rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                progress === 100 ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright' :
                                progress >= 50 ? 'bg-gradient-to-r from-palette-purple to-palette-purple-dark' : 
                                'bg-gradient-to-r from-palette-coral to-palette-coral-light'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-center font-semibold text-palette-text-light/80">
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
          <div className="mt-8 p-6 glass-card-light rounded-2xl">
            <h4 className="text-sm font-semibold text-palette-text-light mb-4">Subject Legend</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-palette-purple shadow-lg"></div>
                <span className="text-palette-text-light/80 font-medium">Math (Linear Algebra, Calculus)</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-palette-yellow shadow-lg"></div>
                <span className="text-palette-text-light/80 font-medium">Stats & Python</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-palette-coral shadow-lg"></div>
                <span className="text-palette-text-light/80 font-medium">DS & Algorithms</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-palette-purple shadow-lg"></div>
                <span className="text-palette-text-light/80 font-medium">Machine Learning</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 rounded-full bg-palette-coral shadow-lg"></div>
                <span className="text-palette-text-light/80 font-medium">AI & DBMS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;