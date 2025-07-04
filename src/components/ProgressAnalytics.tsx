import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Award, Calendar, BookOpen, Activity, Zap } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import ProgressHistoryPanel from './ProgressHistoryPanel';
import { subjectColors } from '../data/studySchedule';

const ProgressAnalytics: React.FC = () => {
  const { schedule, resetSystemState } = useStudy();

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    const scheduleEntries = Object.entries(schedule);
    const totalDays = scheduleEntries.length;
    const completedDays = scheduleEntries.filter(([_, day]) => day.progress.completionPercentage === 100).length;
    const totalPlannedHours = scheduleEntries.reduce((sum, [_, day]) => sum + day.plannedHours, 0);
    const totalActualHours = scheduleEntries.reduce((sum, [_, day]) => sum + day.progress.actualHours, 0);
    const averageCompletion = scheduleEntries.reduce((sum, [_, day]) => sum + day.progress.completionPercentage, 0) / totalDays;

    // Subject-wise progress
    const subjectProgress: { [key: string]: { planned: number; actual: number; completion: number; days: number } } = {};
    scheduleEntries.forEach(([_, day]) => {
      if (!subjectProgress[day.subject]) {
        subjectProgress[day.subject] = { planned: 0, actual: 0, completion: 0, days: 0 };
      }
      subjectProgress[day.subject].planned += day.plannedHours;
      subjectProgress[day.subject].actual += day.progress.actualHours;
      subjectProgress[day.subject].completion += day.progress.completionPercentage;
      subjectProgress[day.subject].days += 1;
    });

    // Calculate average completion per subject
    Object.keys(subjectProgress).forEach(subject => {
      subjectProgress[subject].completion = subjectProgress[subject].completion / subjectProgress[subject].days;
    });

    // Weekly progress data
    const weeklyData: { [key: number]: { completion: number; hours: number; days: number } } = {};
    scheduleEntries.forEach(([_, day]) => {
      if (!weeklyData[day.week]) {
        weeklyData[day.week] = { completion: 0, hours: 0, days: 0 };
      }
      weeklyData[day.week].completion += day.progress.completionPercentage;
      weeklyData[day.week].hours += day.progress.actualHours;
      weeklyData[day.week].days += 1;
    });

    const weeklyProgress = Object.entries(weeklyData).map(([week, data]) => ({
      week: `Week ${week}`,
      completion: Math.round(data.completion / data.days),
      hours: Math.round(data.hours * 10) / 10
    }));

    return {
      totalDays,
      completedDays,
      totalPlannedHours,
      totalActualHours,
      averageCompletion: Math.round(averageCompletion),
      subjectProgress,
      weeklyProgress
    };
  }, [schedule]);

  const chartColors = ['#C8A8E9', '#F4E76E', '#FF8A65', '#A688C7', '#F9ED7A', '#FFB74D'];

  const subjectChartData = Object.entries(analyticsData.subjectProgress).map(([subject, data], index) => ({
    subject: subject.length > 12 ? subject.substring(0, 12) + '...' : subject,
    completion: Math.round(data.completion),
    plannedHours: data.planned,
    actualHours: data.actual,
    fill: chartColors[index % chartColors.length]
  }));

  const stats = [
    {
      label: 'Overall Progress',
      value: `${analyticsData.averageCompletion}%`,
      icon: TrendingUp,
      gradient: 'from-palette-medium-orchid to-palette-light-violet',
      bgColor: 'from-palette-medium-orchid/10 to-palette-medium-orchid/5'
    },
    {
      label: 'Days Completed',
      value: `${analyticsData.completedDays}/${analyticsData.totalDays}`,
      icon: Target,
      gradient: 'from-palette-yellow to-palette-yellow-bright',
      bgColor: 'from-palette-yellow/10 to-palette-yellow/5'
    },
    {
      label: 'Hours Studied',
      value: `${analyticsData.totalActualHours}h`,
      icon: Clock,
      gradient: 'from-palette-coral to-palette-coral-light',
      bgColor: 'from-palette-coral/10 to-palette-coral/5'
    },
    {
      label: 'Current Streak',
      value: `${resetSystemState?.currentStreak || 0} days`,
      icon: Award,
      gradient: 'from-palette-medium-orchid to-palette-coral',
      bgColor: 'from-palette-medium-orchid/10 to-palette-coral/5'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, gradient, bgColor }) => (
          <div key={label} className="group relative overflow-hidden">
            <div className={`glass-card bg-gradient-to-br ${bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 group-hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-palette-text-light/70">{label}</p>
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

      {/* Progress History Panel */}
      <ProgressHistoryPanel />

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <div className="glass-card rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
            <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2.5 rounded-xl shadow-lg mr-3">
              <TrendingUp className="h-5 w-5 text-palette-white" />
            </div>
            Weekly Progress Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C8A8E9" opacity={0.3} />
                <XAxis dataKey="week" stroke="#F5F5F5" />
                <YAxis stroke="#F5F5F5" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(42, 42, 42, 0.95)', 
                    border: '1px solid rgba(200, 168, 233, 0.3)', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#F5F5F5'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#C8A8E9" 
                  strokeWidth={3}
                  dot={{ fill: '#C8A8E9', strokeWidth: 2, r: 6 }}
                  name="Completion %" 
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#F4E76E" 
                  strokeWidth={3}
                  dot={{ fill: '#F4E76E', strokeWidth: 2, r: 6 }}
                  name="Hours Studied" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress Chart */}
        <div className="glass-card rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
            <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-2.5 rounded-xl shadow-lg mr-3">
              <BookOpen className="h-5 w-5 text-palette-primary-black" />
            </div>
            Subject Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#C8A8E9" opacity={0.3} />
                <XAxis dataKey="subject" stroke="#F5F5F5" />
                <YAxis stroke="#F5F5F5" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(42, 42, 42, 0.95)', 
                    border: '1px solid rgba(200, 168, 233, 0.3)', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#F5F5F5'
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="completion" 
                  fill="#C8A8E9" 
                  name="Completion %" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Chart */}
        <div className="glass-card rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
            <div className="bg-gradient-to-r from-palette-coral to-palette-coral-light p-2.5 rounded-xl shadow-lg mr-3">
              <Clock className="h-5 w-5 text-palette-white" />
            </div>
            Time Distribution
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, actualHours }) => `${subject}: ${actualHours}h`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="actualHours"
                >
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(42, 42, 42, 0.95)', 
                    border: '1px solid rgba(200, 168, 233, 0.3)', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#F5F5F5'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Study Consistency */}
        <div className="glass-card rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
            <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-2.5 rounded-xl shadow-lg mr-3">
              <Activity className="h-5 w-5 text-palette-primary-black" />
            </div>
            Study Consistency
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 glass-card-light rounded-xl">
              <span className="text-sm font-semibold text-palette-text-light/70">Planned vs Actual Hours</span>
              <span className="text-lg font-bold text-palette-text-light">
                {analyticsData.totalActualHours}h / {analyticsData.totalPlannedHours}h
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-palette-bg-darker rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ 
                    width: `${Math.min((analyticsData.totalActualHours / analyticsData.totalPlannedHours) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-gradient-to-br from-palette-yellow/10 to-palette-yellow/5 rounded-xl border border-palette-yellow/20">
                <div className="text-3xl font-bold text-palette-yellow mb-2">
                  {Math.round((analyticsData.completedDays / analyticsData.totalDays) * 100)}%
                </div>
                <div className="text-sm font-semibold text-palette-text-light/70">Days Completed</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-palette-medium-orchid/10 to-palette-medium-orchid/5 rounded-xl border border-palette-medium-orchid/20">
                <div className="text-3xl font-bold text-palette-medium-orchid mb-2">
                  {Math.round((analyticsData.totalActualHours / analyticsData.totalPlannedHours) * 100)}%
                </div>
                <div className="text-sm font-semibold text-palette-text-light/70">Hours Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Detailed Subject Analysis */}
      <div className="glass-card rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 border-b border-palette-medium-orchid/20">
          <h3 className="text-xl font-bold text-palette-text-light flex items-center">
            <div className="bg-gradient-to-r from-palette-coral to-palette-yellow p-2.5 rounded-xl shadow-lg mr-3">
              <Zap className="h-5 w-5 text-palette-primary-black" />
            </div>
            Detailed Subject Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-palette-bg-darker/50">
              <tr>
                <th className="text-left py-4 px-6 font-bold text-palette-text-light">Subject</th>
                <th className="text-left py-4 px-6 font-bold text-palette-text-light">Progress</th>
                <th className="text-left py-4 px-6 font-bold text-palette-text-light">Planned Hours</th>
                <th className="text-left py-4 px-6 font-bold text-palette-text-light">Actual Hours</th>
                <th className="text-left py-4 px-6 font-bold text-palette-text-light">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analyticsData.subjectProgress).map(([subject, data], index) => (
                <tr key={subject} className={`border-b border-palette-medium-orchid/20 hover:bg-palette-bg-darker/50 transition-colors ${index % 2 === 0 ? 'bg-palette-bg-darker/30' : ''}`}>
                  <td className="py-4 px-6 font-semibold text-palette-text-light">{subject}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-palette-bg-darker rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral h-3 rounded-full transition-all duration-500"
                          style={{ width: `${data.completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-palette-text-light/80">{Math.round(data.completion)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-palette-text-light/80">{data.planned}h</td>
                  <td className="py-4 px-6 font-semibold text-palette-text-light/80">{data.actual}h</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      data.actual >= data.planned 
                        ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright text-palette-primary-black'
                        : 'bg-gradient-to-r from-palette-coral to-palette-coral-light text-palette-white'
                    }`}>
                      {data.planned > 0 ? Math.round((data.actual / data.planned) * 100) : 0}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProgressAnalytics;