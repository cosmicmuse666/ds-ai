import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Clock, Award, Calendar, BookOpen } from 'lucide-react';
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
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      label: 'Days Completed',
      value: `${analyticsData.completedDays}/${analyticsData.totalDays}`,
      icon: Target,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      label: 'Hours Studied',
      value: `${analyticsData.totalActualHours}h`,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      label: 'Study Streak',
      value: '7 days',
      icon: Award,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon, color, bgColor }) => (
          <div key={label} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
              </div>
              <div className={`${bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2" />
            Weekly Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analyticsData.weeklyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completion" stroke="#3B82F6" name="Completion %" />
                <Line type="monotone" dataKey="hours" stroke="#10B981" name="Hours Studied" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Progress Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Subject-wise Progress
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="subject" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completion" fill="#3B82F6" name="Completion %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Time Distribution Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Time Distribution by Subject
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={subjectChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ subject, actualHours }) => `${subject}: ${actualHours}h`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="actualHours"
                >
                  {subjectChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Study Consistency Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Study Consistency
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Planned vs Actual Hours</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {analyticsData.totalActualHours}h / {analyticsData.totalPlannedHours}h
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${Math.min((analyticsData.totalActualHours / analyticsData.totalPlannedHours) * 100, 100)}%` 
                }}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {Math.round((analyticsData.completedDays / analyticsData.totalDays) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Days Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round((analyticsData.totalActualHours / analyticsData.totalPlannedHours) * 100)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Hours Target</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Subject Analysis */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Detailed Subject Analysis
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Progress</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Planned Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actual Hours</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Efficiency</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analyticsData.subjectProgress).map(([subject, data]) => (
                <tr key={subject} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4 text-gray-900 dark:text-white">{subject}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${data.completion}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{Math.round(data.completion)}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{data.planned}h</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{data.actual}h</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      data.actual >= data.planned 
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
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