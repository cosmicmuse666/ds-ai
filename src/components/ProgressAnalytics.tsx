import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Award, Calendar, BookOpen, Activity, Zap } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { subjectColors } from '../data/studySchedule';

const ProgressAnalytics: React.FC = () => {
  const { schedule } = useStudy();

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

  const chartColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

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
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      label: 'Days Completed',
      value: `${analyticsData.completedDays}/${analyticsData.totalDays}`,
      icon: Target,
      gradient: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    },
    {
      label: 'Hours Studied',
      value: `${analyticsData.totalActualHours}h`,
      icon: Clock,
      gradient: 'from-orange-500 to-orange-600',
      bgColor: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: Award,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, gradient, bgColor }) => (
          <div key={label} className="group relative overflow-hidden">
            <div className={`bg-gradient-to-br ${bgColor} rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-200/50 dark:border-gray-700/50 group-hover:scale-105`}>
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                </div>
                <div className={`bg-gradient-to-r ${gradient} p-4 rounded-2xl shadow-lg`}>
                  <Icon className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Progress Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2.5 rounded-xl shadow-lg mr-3">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            Weekly Progress Trend
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="completion" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 6 }}
                  name="Completion %" 
                />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                  name="Hours Studied" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-2.5 rounded-xl shadow-lg mr-3">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            Subject Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="subject" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="completion" 
                  fill="url(#colorGradient)" 
                  name="Completion %" 
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Chart */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-2.5 rounded-xl shadow-lg mr-3">
              <Clock className="h-5 w-5 text-white" />
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
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enhanced Study Consistency */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-violet-500 p-2.5 rounded-xl shadow-lg mr-3">
              <Activity className="h-5 w-5 text-white" />
            </div>
            Study Consistency
          </h3>
          <div className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-xl">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Planned vs Actual Hours</span>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                {analyticsData.totalActualHours}h / {analyticsData.totalPlannedHours}h
              </span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-700 ease-out shadow-lg"
                  style={{ 
                    width: `${Math.min((analyticsData.totalActualHours / analyticsData.totalPlannedHours) * 100, 100)}%` 
                  }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200/50 dark:border-green-700/50">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {Math.round((analyticsData.completedDays / analyticsData.totalDays) * 100)}%
                </div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Days Completed</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {Math.round((analyticsData.totalActualHours / analyticsData.totalPlannedHours) * 100)}%
                </div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">Hours Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Detailed Subject Analysis */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-2.5 rounded-xl shadow-lg mr-3">
              <Zap className="h-5 w-5 text-white" />
            </div>
            Detailed Subject Analysis
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Subject</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Progress</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Planned Hours</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Actual Hours</th>
                <th className="text-left py-4 px-6 font-bold text-gray-900 dark:text-white">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analyticsData.subjectProgress).map(([subject, data], index) => (
                <tr key={subject} className={`border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors ${index % 2 === 0 ? 'bg-white/30 dark:bg-gray-800/30' : ''}`}>
                  <td className="py-4 px-6 font-semibold text-gray-900 dark:text-white">{subject}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${data.completion}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{Math.round(data.completion)}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">{data.planned}h</td>
                  <td className="py-4 px-6 font-semibold text-gray-600 dark:text-gray-400">{data.actual}h</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                      data.actual >= data.planned 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white'
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