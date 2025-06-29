import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Award,
  BookOpen,
  BarChart3,
  Settings,
  X,
  Download,
  Mail
} from 'lucide-react';
import { format, subDays, addDays, isToday, isYesterday, isTomorrow } from 'date-fns';
import { useStudy } from '../context/StudyContext';

interface NotificationSettings {
  enabled: boolean;
  time: string;
  email: string;
  includeWeeklyOverview: boolean;
  includeCatchupRecommendations: boolean;
  includeScheduleAdjustments: boolean;
}

interface DailySummaryData {
  yesterday: {
    completed: Array<{
      subject: string;
      duration: number;
      keyTopics: string[];
      completionRate: number;
    }>;
    missed: Array<{
      subject: string;
      plannedDuration: number;
      reason?: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  today: Array<{
    subject: string;
    timeAllocation: number;
    priority: 'high' | 'medium' | 'low';
    estimatedDuration: number;
    tasks: string[];
  }>;
  tomorrow: Array<{
    subject: string;
    plannedDuration: number;
    topics: string[];
    priority: 'high' | 'medium' | 'low';
  }>;
  streak: number;
  weeklyProgress: {
    completionRate: number;
    totalHours: number;
    subjectsStudied: number;
  };
  recommendations: {
    catchup: string[];
    scheduleAdjustments: string[];
  };
}

const StudyNotificationSystem: React.FC = () => {
  const { schedule } = useStudy();
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>({
    enabled: true,
    time: '08:00',
    email: '',
    includeWeeklyOverview: true,
    includeCatchupRecommendations: true,
    includeScheduleAdjustments: true
  });
  const [summaryData, setSummaryData] = useState<DailySummaryData | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Generate daily summary data
  const generateDailySummary = (): DailySummaryData => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const tomorrow = addDays(today, 1);

    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    // Yesterday's data
    const yesterdayData = schedule[yesterdayStr];
    const completed = yesterdayData ? [{
      subject: yesterdayData.subject,
      duration: yesterdayData.progress.actualHours,
      keyTopics: yesterdayData.tasks.slice(0, 3),
      completionRate: yesterdayData.progress.completionPercentage
    }] : [];

    const missed = yesterdayData && yesterdayData.progress.completionPercentage < 100 ? [{
      subject: yesterdayData.subject,
      plannedDuration: yesterdayData.plannedHours,
      reason: yesterdayData.progress.completionPercentage === 0 ? 'Not started' : 'Partially completed',
      priority: yesterdayData.plannedHours > 3 ? 'high' as const : 'medium' as const
    }] : [];

    // Today's data
    const todayData = schedule[todayStr];
    const todayTasks = todayData ? [{
      subject: todayData.subject,
      timeAllocation: todayData.plannedHours,
      priority: todayData.plannedHours > 3 ? 'high' as const : 'medium' as const,
      estimatedDuration: todayData.plannedHours,
      tasks: todayData.tasks
    }] : [];

    // Tomorrow's data
    const tomorrowData = schedule[tomorrowStr];
    const tomorrowTasks = tomorrowData ? [{
      subject: tomorrowData.subject,
      plannedDuration: tomorrowData.plannedHours,
      topics: tomorrowData.tasks.slice(0, 2),
      priority: tomorrowData.plannedHours > 3 ? 'high' as const : 'medium' as const
    }] : [];

    // Calculate streak
    let streak = 0;
    let currentDate = subDays(today, 1);
    for (let i = 0; i < 30; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dayData = schedule[dateStr];
      if (dayData && dayData.progress.completionPercentage === 100) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    // Weekly progress
    const weekDates = Array.from({ length: 7 }, (_, i) => subDays(today, i));
    const weekData = weekDates.map(date => {
      const dateStr = date.toISOString().split('T')[0];
      return schedule[dateStr];
    }).filter(Boolean);

    const weeklyProgress = {
      completionRate: Math.round(weekData.reduce((sum, day) => sum + day.progress.completionPercentage, 0) / weekData.length),
      totalHours: weekData.reduce((sum, day) => sum + day.progress.actualHours, 0),
      subjectsStudied: new Set(weekData.map(day => day.subject)).size
    };

    // Recommendations
    const recommendations = {
      catchup: missed.length > 0 ? [
        `Focus on ${missed[0].subject} - ${missed[0].plannedDuration}h behind schedule`,
        'Consider extending today\'s study session by 30 minutes',
        'Review yesterday\'s incomplete topics during breaks'
      ] : [],
      scheduleAdjustments: weeklyProgress.completionRate < 80 ? [
        'Reduce daily study hours by 0.5h to improve consistency',
        'Add 15-minute buffer time between subjects',
        'Consider moving difficult topics to morning sessions'
      ] : []
    };

    return {
      yesterday: { completed, missed },
      today: todayTasks,
      tomorrow: tomorrowTasks,
      streak,
      weeklyProgress,
      recommendations
    };
  };

  useEffect(() => {
    setSummaryData(generateDailySummary());
  }, [schedule]);

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const getPriorityIcon = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-3 w-3" />;
      case 'medium': return <Clock className="h-3 w-3" />;
      case 'low': return <CheckCircle2 className="h-3 w-3" />;
    }
  };

  const exportSummary = () => {
    if (!summaryData) return;
    
    const summaryText = `
DAILY STUDY SUMMARY - ${format(new Date(), 'MMMM d, yyyy')}

📊 YESTERDAY'S PERFORMANCE
${summaryData.yesterday.completed.map(item => 
  `✅ ${item.subject} - ${item.duration}h (${item.completionRate}%)\n   Key Topics: ${item.keyTopics.join(', ')}`
).join('\n')}

${summaryData.yesterday.missed.map(item => 
  `❌ ${item.subject} - Missed ${item.plannedDuration}h (${item.reason})`
).join('\n')}

📅 TODAY'S SCHEDULE
${summaryData.today.map(item => 
  `🎯 ${item.subject} - ${item.timeAllocation}h [${item.priority.toUpperCase()}]\n   Tasks: ${item.tasks.slice(0, 3).join(', ')}`
).join('\n')}

🔮 TOMORROW'S PREVIEW
${summaryData.tomorrow.map(item => 
  `📚 ${item.subject} - ${item.plannedDuration}h\n   Topics: ${item.topics.join(', ')}`
).join('\n')}

🔥 STUDY STREAK: ${summaryData.streak} days

📈 WEEKLY OVERVIEW
• Completion Rate: ${summaryData.weeklyProgress.completionRate}%
• Total Hours: ${summaryData.weeklyProgress.totalHours}h
• Subjects Studied: ${summaryData.weeklyProgress.subjectsStudied}

💡 RECOMMENDATIONS
${summaryData.recommendations.catchup.map(rec => `• ${rec}`).join('\n')}
${summaryData.recommendations.scheduleAdjustments.map(rec => `• ${rec}`).join('\n')}
    `;

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-summary-${format(new Date(), 'yyyy-MM-dd')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!summaryData) return null;

  return (
    <>
      {/* Notification Bell */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-3 bg-white rounded-full shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <Bell className="h-5 w-5 text-gray-700" />
          {summaryData.yesterday.missed.length > 0 && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
          )}
        </button>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-palette-purple/10 to-palette-yellow/10 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-palette-purple/20 p-2 rounded-lg">
                    <BarChart3 className="h-5 w-5 text-palette-purple" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Daily Study Summary</h2>
                    <p className="text-sm text-gray-600">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={exportSummary}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Settings className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] custom-scrollbar">
              <div className="p-6 space-y-6">

                {/* Study Streak & Weekly Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <div className="flex items-center space-x-3">
                      <Award className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="text-sm font-semibold text-orange-800">Study Streak</p>
                        <p className="text-2xl font-bold text-orange-600">{summaryData.streak} days</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-center space-x-3">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-sm font-semibold text-blue-800">Weekly Rate</p>
                        <p className="text-2xl font-bold text-blue-600">{summaryData.weeklyProgress.completionRate}%</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <div className="flex items-center space-x-3">
                      <Clock className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-semibold text-green-800">Weekly Hours</p>
                        <p className="text-2xl font-bold text-green-600">{summaryData.weeklyProgress.totalHours}h</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yesterday's Performance */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-600" />
                    Yesterday's Performance
                  </h3>
                  
                  {/* Completed Topics */}
                  {summaryData.yesterday.completed.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-green-700 flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Successfully Completed
                      </h4>
                      {summaryData.yesterday.completed.map((item, index) => (
                        <div key={index} className="bg-green-50 rounded-lg p-4 border border-green-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-green-800">{item.subject}</h5>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-green-600">{item.duration}h studied</span>
                              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                                {item.completionRate}%
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-green-700 font-medium mb-1">Key Concepts Covered:</p>
                            <ul className="text-sm text-green-600 space-y-1">
                              {item.keyTopics.map((topic, i) => (
                                <li key={i} className="flex items-center">
                                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></span>
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Missed Topics */}
                  {summaryData.yesterday.missed.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold text-red-700 flex items-center">
                        <XCircle className="h-4 w-4 mr-2" />
                        Missed or Incomplete
                      </h4>
                      {summaryData.yesterday.missed.map((item, index) => (
                        <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-semibold text-red-800">{item.subject}</h5>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(item.priority)}`}>
                                {getPriorityIcon(item.priority)}
                                <span className="ml-1">{item.priority.toUpperCase()}</span>
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-red-600">Planned: {item.plannedDuration}h</span>
                            <span className="text-sm text-red-700 font-medium">{item.reason}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Today's Schedule */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <Target className="h-5 w-5 mr-2 text-gray-600" />
                    Today's Schedule
                  </h3>
                  {summaryData.today.map((item, index) => (
                    <div key={index} className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-yellow-800">{item.subject}</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-yellow-600">
                            {item.timeAllocation}h allocated
                          </span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(item.priority)}`}>
                            {getPriorityIcon(item.priority)}
                            <span className="ml-1">{item.priority.toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-yellow-700 font-medium mb-2">Today's Tasks:</p>
                        <ul className="text-sm text-yellow-600 space-y-1">
                          {item.tasks.slice(0, 4).map((task, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-2"></span>
                              {task}
                            </li>
                          ))}
                          {item.tasks.length > 4 && (
                            <li className="text-yellow-500 text-xs">+{item.tasks.length - 4} more tasks</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tomorrow's Preview */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center">
                    <BookOpen className="h-5 w-5 mr-2 text-gray-600" />
                    Tomorrow's Preview
                  </h3>
                  {summaryData.tomorrow.map((item, index) => (
                    <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-blue-800">{item.subject}</h5>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-blue-600">
                            {item.plannedDuration}h planned
                          </span>
                          <span className={`px-2 py-1 text-xs font-bold rounded-full border ${getPriorityColor(item.priority)}`}>
                            {getPriorityIcon(item.priority)}
                            <span className="ml-1">{item.priority.toUpperCase()}</span>
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-blue-700 font-medium mb-1">Upcoming Topics:</p>
                        <ul className="text-sm text-blue-600 space-y-1">
                          {item.topics.map((topic, i) => (
                            <li key={i} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                              {topic}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recommendations */}
                {(summaryData.recommendations.catchup.length > 0 || summaryData.recommendations.scheduleAdjustments.length > 0) && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-gray-600" />
                      Recommendations
                    </h3>
                    
                    {summaryData.recommendations.catchup.length > 0 && (
                      <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <h4 className="text-sm font-semibold text-orange-800 mb-3 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Catch-up Suggestions
                        </h4>
                        <ul className="space-y-2">
                          {summaryData.recommendations.catchup.map((rec, i) => (
                            <li key={i} className="text-sm text-orange-700 flex items-start">
                              <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mr-2 mt-2"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {summaryData.recommendations.scheduleAdjustments.length > 0 && (
                      <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <h4 className="text-sm font-semibold text-purple-800 mb-3 flex items-center">
                          <Settings className="h-4 w-4 mr-2" />
                          Schedule Optimization
                        </h4>
                        <ul className="space-y-2">
                          {summaryData.recommendations.scheduleAdjustments.map((rec, i) => (
                            <li key={i} className="text-sm text-purple-700 flex items-start">
                              <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 mt-2"></span>
                              {rec}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Notification Settings */}
                {showPreview && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Notification Settings
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">Daily notifications</label>
                        <input
                          type="checkbox"
                          checked={settings.enabled}
                          onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                          className="rounded border-gray-300"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">Notification time</label>
                        <input
                          type="time"
                          value={settings.time}
                          onChange={(e) => setSettings(prev => ({ ...prev, time: e.target.value }))}
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <label className="text-sm text-gray-700">Email notifications</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          value={settings.email}
                          onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                          className="text-sm border border-gray-300 rounded px-2 py-1 w-40"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StudyNotificationSystem;