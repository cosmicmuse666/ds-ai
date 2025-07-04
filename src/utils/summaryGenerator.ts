import { StudySchedule, StudyDay } from '../types';
import { format, subDays, addDays } from 'date-fns';

export interface SummaryReport {
  date: string;
  yesterday: {
    completed: Array<{
      subject: string;
      duration: number;
      keyTopics: string[];
      completionRate: number;
      priority: 'high' | 'medium' | 'low';
    }>;
    missed: Array<{
      subject: string;
      plannedDuration: number;
      reason: string;
      priority: 'high' | 'medium' | 'low';
    }>;
  };
  today: Array<{
    subject: string;
    timeAllocation: number;
    priority: 'high' | 'medium' | 'low';
    estimatedDuration: number;
    tasks: string[];
    recommendedStartTime: string;
  }>;
  tomorrow: Array<{
    subject: string;
    plannedDuration: number;
    topics: string[];
    priority: 'high' | 'medium' | 'low';
    preparationTips: string[];
  }>;
  streak: number;
  weeklyProgress: {
    completionRate: number;
    totalHours: number;
    subjectsStudied: number;
    consistencyScore: number;
  };
  recommendations: {
    catchup: string[];
    scheduleAdjustments: string[];
    studyTips: string[];
  };
}

export const generateDailySummaryReport = (schedule: StudySchedule): SummaryReport => {
  const today = new Date();
  const yesterday = subDays(today, 1);
  const tomorrow = addDays(today, 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  // Helper function to determine priority
  const getPriority = (hours: number, completionRate?: number): 'high' | 'medium' | 'low' => {
    if (hours >= 4) return 'high';
    if (hours >= 2) return 'medium';
    return 'low';
  };

  // Helper function to get study tips based on subject
  const getStudyTips = (subject: string): string[] => {
    const tips: { [key: string]: string[] } = {
      'Linear Algebra': [
        'Practice matrix operations daily',
        'Visualize transformations geometrically',
        'Work through proofs step by step'
      ],
      'Calculus': [
        'Master fundamental theorems first',
        'Practice integration techniques regularly',
        'Connect concepts to real-world applications'
      ],
      'Machine Learning': [
        'Implement algorithms from scratch',
        'Work with real datasets',
        'Understand mathematical foundations'
      ],
      'Data Structures': [
        'Code implementations by hand',
        'Analyze time and space complexity',
        'Practice with different problem types'
      ]
    };
    return tips[subject] || ['Review concepts regularly', 'Practice problem-solving', 'Take detailed notes'];
  };

  // Yesterday's analysis
  const yesterdayData = schedule[yesterdayStr];
  const completed = yesterdayData && yesterdayData.progress.completionPercentage > 0 ? [{
    subject: yesterdayData.subject,
    duration: yesterdayData.progress.actualHours,
    keyTopics: yesterdayData.tasks.slice(0, Math.min(3, yesterdayData.progress.tasksCompleted)),
    completionRate: yesterdayData.progress.completionPercentage,
    priority: getPriority(yesterdayData.plannedHours, yesterdayData.progress.completionPercentage)
  }] : [];

  const missed = yesterdayData && yesterdayData.progress.completionPercentage < 100 ? [{
    subject: yesterdayData.subject,
    plannedDuration: yesterdayData.plannedHours,
    reason: yesterdayData.progress.completionPercentage === 0 
      ? 'Not started - Consider time management review'
      : `${100 - yesterdayData.progress.completionPercentage}% incomplete - May need more focused study time`,
    priority: getPriority(yesterdayData.plannedHours)
  }] : [];

  // Today's schedule
  const todayData = schedule[todayStr];
  const todayTasks = todayData ? [{
    subject: todayData.subject,
    timeAllocation: todayData.plannedHours,
    priority: getPriority(todayData.plannedHours),
    estimatedDuration: todayData.plannedHours,
    tasks: todayData.tasks,
    recommendedStartTime: todayData.plannedHours >= 3 ? '09:00' : '10:00'
  }] : [];

  // Tomorrow's preview
  const tomorrowData = schedule[tomorrowStr];
  const tomorrowTasks = tomorrowData ? [{
    subject: tomorrowData.subject,
    plannedDuration: tomorrowData.plannedHours,
    topics: tomorrowData.tasks.slice(0, 3),
    priority: getPriority(tomorrowData.plannedHours),
    preparationTips: getStudyTips(tomorrowData.subject)
  }] : [];

  // Calculate study streak
  let streak = 0;
  let currentDate = subDays(today, 1);
  for (let i = 0; i < 30; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = schedule[dateStr];
    if (dayData && dayData.progress.completionPercentage >= 80) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  // Weekly progress analysis
  const weekDates = Array.from({ length: 7 }, (_, i) => subDays(today, i));
  const weekData = weekDates.map(date => {
    const dateStr = date.toISOString().split('T')[0];
    return schedule[dateStr];
  }).filter(Boolean);

  const weeklyProgress = {
    completionRate: Math.round(weekData.reduce((sum, day) => sum + day.progress.completionPercentage, 0) / weekData.length),
    totalHours: Math.round(weekData.reduce((sum, day) => sum + day.progress.actualHours, 0) * 10) / 10,
    subjectsStudied: new Set(weekData.map(day => day.subject)).size,
    consistencyScore: Math.round((weekData.filter(day => day.progress.completionPercentage >= 80).length / weekData.length) * 100)
  };

  // Generate intelligent recommendations
  const recommendations = {
    catchup: missed.length > 0 ? [
      `Priority: Complete ${missed[0].subject} - ${missed[0].plannedDuration}h behind schedule`,
      'Consider breaking large topics into 25-minute focused sessions',
      'Review yesterday\'s incomplete material during today\'s breaks',
      'Adjust today\'s schedule to include 30 minutes of catch-up time'
    ] : [
      'Great job staying on track! Maintain this momentum',
      'Consider reviewing previous topics for better retention'
    ],
    
    scheduleAdjustments: weeklyProgress.completionRate < 75 ? [
      'Reduce daily study hours by 0.5-1h to improve consistency',
      'Add 15-minute buffer time between subjects',
      'Move challenging topics to your most productive hours',
      'Consider shorter, more frequent study sessions'
    ] : weeklyProgress.completionRate > 95 ? [
      'Excellent consistency! Consider increasing study intensity',
      'Add advanced practice problems to your routine',
      'Explore additional resources for deeper understanding'
    ] : [
      'Your current schedule is working well',
      'Fine-tune timing based on energy levels throughout the day'
    ],
    
    studyTips: todayData ? getStudyTips(todayData.subject) : [
      'Start with the most challenging topic when energy is highest',
      'Use active recall techniques during study sessions',
      'Take regular breaks to maintain focus'
    ]
  };

  return {
    date: format(today, 'yyyy-MM-dd'),
    yesterday: { completed, missed },
    today: todayTasks,
    tomorrow: tomorrowTasks,
    streak,
    weeklyProgress,
    recommendations
  };
};

export const formatSummaryForEmail = (report: SummaryReport): string => {
  return `
📚 DAILY STUDY SUMMARY - ${format(new Date(report.date), 'EEEE, MMMM d, yyyy')}

🔥 STUDY STREAK: ${report.streak} days
📊 WEEKLY COMPLETION: ${report.weeklyProgress.completionRate}% (${report.weeklyProgress.totalHours}h total)

📈 YESTERDAY'S PERFORMANCE
${report.yesterday.completed.map(item => 
  `✅ ${item.subject} - ${item.duration}h completed (${item.completionRate}%)
     📝 Key Topics: ${item.keyTopics.join(', ')}`
).join('\n')}

${report.yesterday.missed.map(item => 
  `❌ ${item.subject} - ${item.plannedDuration}h missed
     💡 ${item.reason}`
).join('\n')}

🎯 TODAY'S FOCUS
${report.today.map(item => 
  `📚 ${item.subject} - ${item.timeAllocation}h [${item.priority.toUpperCase()} PRIORITY]
     ⏰ Recommended start: ${item.recommendedStartTime}
     📋 Tasks: ${item.tasks.slice(0, 3).join(', ')}${item.tasks.length > 3 ? ` (+${item.tasks.length - 3} more)` : ''}`
).join('\n')}

🔮 TOMORROW'S PREVIEW
${report.tomorrow.map(item => 
  `📖 ${item.subject} - ${item.plannedDuration}h planned
     📝 Topics: ${item.topics.join(', ')}
     💡 Prep tips: ${item.preparationTips.slice(0, 2).join(', ')}`
).join('\n')}

💡 PERSONALIZED RECOMMENDATIONS

🎯 Catch-up Actions:
${report.recommendations.catchup.map(rec => `• ${rec}`).join('\n')}

⚙️ Schedule Optimization:
${report.recommendations.scheduleAdjustments.map(rec => `• ${rec}`).join('\n')}

📚 Study Tips:
${report.recommendations.studyTips.map(tip => `• ${tip}`).join('\n')}

---
Keep up the great work! 🚀
  `;
};