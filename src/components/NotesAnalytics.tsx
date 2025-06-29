import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Brain, TrendingUp, Target, Clock, Tag, MessageSquare, Lightbulb, AlertTriangle, Star, Zap, Calendar, BookOpen, Award, Eye, Filter } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { format, subDays, parseISO } from 'date-fns';

interface NotesAnalyticsProps {
  selectedDate: string;
}

const NotesAnalytics: React.FC<NotesAnalyticsProps> = ({ selectedDate }) => {
  const { schedule } = useStudy();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [analysisType, setAnalysisType] = useState<'overview' | 'patterns' | 'insights'>('overview');

  // Calculate analytics data
  const analyticsData = React.useMemo(() => {
    const today = new Date(selectedDate);
    let dateRange: Date[] = [];
    
    switch (timeRange) {
      case 'week':
        dateRange = Array.from({ length: 7 }, (_, i) => subDays(today, i));
        break;
      case 'month':
        dateRange = Array.from({ length: 30 }, (_, i) => subDays(today, i));
        break;
      case 'all':
        dateRange = Object.keys(schedule).map(date => parseISO(date));
        break;
    }

    const relevantDays = dateRange
      .map(date => date.toISOString().split('T')[0])
      .filter(dateStr => schedule[dateStr])
      .map(dateStr => ({ date: dateStr, data: schedule[dateStr] }));

    // Word count analysis
    const wordCounts = relevantDays.map(({ date, data }) => {
      const totalWords = Object.values(data.notes)
        .filter(value => typeof value === 'string')
        .join(' ')
        .split(' ')
        .filter(word => word.length > 0).length;
      
      return {
        date: format(parseISO(date), 'MMM d'),
        words: totalWords,
        concepts: (data.notes.conceptsLearned as string).split(' ').filter(w => w.length > 0).length,
        challenges: (data.notes.difficultiesFaced as string).split(' ').filter(w => w.length > 0).length,
        practice: (data.notes.practiceProblems as string).split(' ').filter(w => w.length > 0).length
      };
    });

    // Tag frequency analysis
    const tagFrequency: { [key: string]: number } = {};
    relevantDays.forEach(({ data }) => {
      data.notes.tags.forEach(tag => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
      });
    });

    const topTags = Object.entries(tagFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Subject-wise note distribution
    const subjectNotes: { [key: string]: { words: number, sessions: number } } = {};
    relevantDays.forEach(({ data }) => {
      const subject = data.subject;
      const words = Object.values(data.notes)
        .filter(value => typeof value === 'string')
        .join(' ')
        .split(' ')
        .filter(word => word.length > 0).length;
      
      if (!subjectNotes[subject]) {
        subjectNotes[subject] = { words: 0, sessions: 0 };
      }
      subjectNotes[subject].words += words;
      subjectNotes[subject].sessions += 1;
    });

    const subjectData = Object.entries(subjectNotes).map(([subject, data]) => ({
      subject: subject.length > 12 ? subject.substring(0, 12) + '...' : subject,
      words: data.words,
      sessions: data.sessions,
      avgWords: Math.round(data.words / data.sessions)
    }));

    // Note quality metrics
    const qualityMetrics = relevantDays.map(({ date, data }) => {
      const notes = data.notes;
      const sections = ['conceptsLearned', 'difficultiesFaced', 'practiceProblems', 'resourceFeedback', 'tomorrowFocus', 'quickNotes'];
      const filledSections = sections.filter(section => (notes[section as keyof typeof notes] as string).trim().length > 0).length;
      const completeness = (filledSections / sections.length) * 100;
      
      const totalWords = Object.values(notes)
        .filter(value => typeof value === 'string')
        .join(' ')
        .split(' ')
        .filter(word => word.length > 0).length;
      
      const depth = totalWords > 100 ? 'Deep' : totalWords > 50 ? 'Medium' : 'Light';
      
      return {
        date: format(parseISO(date), 'MMM d'),
        completeness: Math.round(completeness),
        words: totalWords,
        depth,
        tags: notes.tags.length
      };
    });

    // Learning patterns
    const learningPatterns = {
      conceptualDays: relevantDays.filter(({ data }) => 
        (data.notes.conceptsLearned as string).length > (data.notes.practiceProblems as string).length
      ).length,
      practicalDays: relevantDays.filter(({ data }) => 
        (data.notes.practiceProblems as string).length > (data.notes.conceptsLearned as string).length
      ).length,
      balancedDays: relevantDays.filter(({ data }) => {
        const conceptWords = (data.notes.conceptsLearned as string).split(' ').length;
        const practiceWords = (data.notes.practiceProblems as string).split(' ').length;
        return Math.abs(conceptWords - practiceWords) <= 10;
      }).length
    };

    // Insights generation
    const insights = [];
    
    if (wordCounts.length > 0) {
      const avgWords = wordCounts.reduce((sum, day) => sum + day.words, 0) / wordCounts.length;
      if (avgWords > 200) {
        insights.push({ type: 'positive', text: `Excellent note-taking! Averaging ${Math.round(avgWords)} words per session.` });
      } else if (avgWords < 50) {
        insights.push({ type: 'suggestion', text: 'Consider expanding your notes for better retention and review.' });
      }
    }

    if (topTags.length > 0) {
      const mostUsedTag = topTags[0];
      insights.push({ type: 'info', text: `Your most frequent tag is "${mostUsedTag.tag}" (${mostUsedTag.count} times).` });
    }

    if (learningPatterns.conceptualDays > learningPatterns.practicalDays * 2) {
      insights.push({ type: 'suggestion', text: 'Consider balancing theory with more practical exercises.' });
    } else if (learningPatterns.practicalDays > learningPatterns.conceptualDays * 2) {
      insights.push({ type: 'suggestion', text: 'Great practice focus! Consider documenting more conceptual insights.' });
    }

    return {
      wordCounts,
      topTags,
      subjectData,
      qualityMetrics,
      learningPatterns,
      insights,
      totalWords: wordCounts.reduce((sum, day) => sum + day.words, 0),
      totalSessions: relevantDays.length,
      avgWordsPerSession: wordCounts.length > 0 ? Math.round(wordCounts.reduce((sum, day) => sum + day.words, 0) / wordCounts.length) : 0
    };
  }, [schedule, selectedDate, timeRange]);

  const chartColors = ['#B082FF', '#F4E76E', '#FF8A65', '#DBC6FF', '#F9ED7A', '#FFB74D'];

  const timeRangeOptions = [
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const analysisOptions = [
    { value: 'overview', label: 'Overview', icon: Eye },
    { value: 'patterns', label: 'Patterns', icon: TrendingUp },
    { value: 'insights', label: 'Insights', icon: Lightbulb }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 glass-card-light rounded-xl p-1">
            {timeRangeOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTimeRange(value as 'week' | 'month' | 'all')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  timeRange === value
                    ? 'btn-primary'
                    : 'text-palette-text-muted hover:text-palette-text-light hover:bg-palette-medium-orchid/20'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 glass-card-light rounded-xl p-1">
          {analysisOptions.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setAnalysisType(value as 'overview' | 'patterns' | 'insights')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                analysisType === value
                  ? 'btn-primary'
                  : 'text-palette-text-muted hover:text-palette-text-light hover:bg-palette-medium-orchid/20'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-palette-medium-orchid/10 to-palette-medium-orchid/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-palette-text-muted">Total Words</p>
              <p className="text-3xl font-bold text-palette-medium-orchid">{analyticsData.totalWords.toLocaleString()}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-palette-medium-orchid" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-palette-yellow/10 to-palette-yellow/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-palette-text-muted">Sessions</p>
              <p className="text-3xl font-bold text-palette-yellow">{analyticsData.totalSessions}</p>
            </div>
            <Calendar className="h-8 w-8 text-palette-yellow" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-palette-coral/10 to-palette-coral/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-palette-text-muted">Avg Words/Session</p>
              <p className="text-3xl font-bold text-palette-coral">{analyticsData.avgWordsPerSession}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-palette-coral" />
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-palette-medium-orchid/10 to-palette-coral/5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-palette-text-muted">Unique Tags</p>
              <p className="text-3xl font-bold text-palette-text-light">{analyticsData.topTags.length}</p>
            </div>
            <Tag className="h-8 w-8 text-palette-text-light" />
          </div>
        </div>
      </div>

      {analysisType === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Word Count Trend */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet p-2.5 rounded-xl shadow-lg mr-3">
                <TrendingUp className="h-5 w-5 text-palette-primary-black" />
              </div>
              Note Volume Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.wordCounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#B082FF" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#F5F5F5" />
                  <YAxis stroke="#F5F5F5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(27, 25, 24, 0.95)', 
                      border: '1px solid rgba(176, 130, 255, 0.3)', 
                      borderRadius: '12px',
                      color: '#F5F5F5'
                    }} 
                  />
                  <Line type="monotone" dataKey="words" stroke="#B082FF" strokeWidth={3} dot={{ fill: '#B082FF', strokeWidth: 2, r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subject Distribution */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-yellow to-palette-yellow-bright p-2.5 rounded-xl shadow-lg mr-3">
                <BookOpen className="h-5 w-5 text-palette-primary-black" />
              </div>
              Subject Note Distribution
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.subjectData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#B082FF" opacity={0.3} />
                  <XAxis dataKey="subject" stroke="#F5F5F5" />
                  <YAxis stroke="#F5F5F5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(27, 25, 24, 0.95)', 
                      border: '1px solid rgba(176, 130, 255, 0.3)', 
                      borderRadius: '12px',
                      color: '#F5F5F5'
                    }} 
                  />
                  <Bar dataKey="words" fill="#F4E76E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Tags */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-coral to-palette-coral-light p-2.5 rounded-xl shadow-lg mr-3">
                <Tag className="h-5 w-5 text-palette-white" />
              </div>
              Most Used Tags
            </h3>
            <div className="space-y-3">
              {analyticsData.topTags.slice(0, 8).map(({ tag, count }, index) => (
                <div key={tag} className="flex items-center justify-between p-3 glass-card-light rounded-xl">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-palette-primary-black`}
                         style={{ backgroundColor: chartColors[index % chartColors.length] }}>
                      {index + 1}
                    </div>
                    <span className="font-semibold text-palette-text-light">{tag}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-palette-bg-darker rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-palette-medium-orchid to-palette-coral transition-all duration-500"
                        style={{ width: `${(count / analyticsData.topTags[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-palette-text-muted">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Note Quality */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2.5 rounded-xl shadow-lg mr-3">
                <Star className="h-5 w-5 text-palette-white" />
              </div>
              Note Quality Metrics
            </h3>
            <div className="space-y-4">
              {analyticsData.qualityMetrics.slice(-7).map((metric, index) => (
                <div key={metric.date} className="p-4 glass-card-light rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-palette-text-light">{metric.date}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        metric.depth === 'Deep' ? 'bg-palette-yellow/20 text-palette-yellow' :
                        metric.depth === 'Medium' ? 'bg-palette-medium-orchid/20 text-palette-medium-orchid' :
                        'bg-palette-coral/20 text-palette-coral'
                      }`}>
                        {metric.depth}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-palette-text-muted">
                    <span>{metric.words} words</span>
                    <span>{metric.completeness}% complete</span>
                    <span>{metric.tags} tags</span>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-palette-bg-darker rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-palette-medium-orchid to-palette-yellow transition-all duration-500"
                        style={{ width: `${metric.completeness}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {analysisType === 'patterns' && (
        <div className="space-y-8">
          {/* Learning Style Analysis */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-2.5 rounded-xl shadow-lg mr-3">
                <Brain className="h-5 w-5 text-palette-primary-black" />
              </div>
              Learning Style Patterns
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 glass-card-light rounded-xl">
                <div className="text-4xl font-bold text-palette-medium-orchid mb-2">
                  {analyticsData.learningPatterns.conceptualDays}
                </div>
                <div className="text-sm font-semibold text-palette-text-light mb-1">Conceptual Days</div>
                <div className="text-xs text-palette-text-muted">Theory-focused sessions</div>
              </div>
              <div className="text-center p-6 glass-card-light rounded-xl">
                <div className="text-4xl font-bold text-palette-yellow mb-2">
                  {analyticsData.learningPatterns.practicalDays}
                </div>
                <div className="text-sm font-semibold text-palette-text-light mb-1">Practical Days</div>
                <div className="text-xs text-palette-text-muted">Practice-focused sessions</div>
              </div>
              <div className="text-center p-6 glass-card-light rounded-xl">
                <div className="text-4xl font-bold text-palette-coral mb-2">
                  {analyticsData.learningPatterns.balancedDays}
                </div>
                <div className="text-sm font-semibold text-palette-text-light mb-1">Balanced Days</div>
                <div className="text-xs text-palette-text-muted">Theory + Practice mix</div>
              </div>
            </div>
          </div>

          {/* Note Section Analysis */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-coral to-palette-yellow p-2.5 rounded-xl shadow-lg mr-3">
                <BarChart className="h-5 w-5 text-palette-primary-black" />
              </div>
              Note Section Breakdown
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.wordCounts}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#B082FF" opacity={0.3} />
                  <XAxis dataKey="date" stroke="#F5F5F5" />
                  <YAxis stroke="#F5F5F5" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(27, 25, 24, 0.95)', 
                      border: '1px solid rgba(176, 130, 255, 0.3)', 
                      borderRadius: '12px',
                      color: '#F5F5F5'
                    }} 
                  />
                  <Bar dataKey="concepts" stackId="a" fill="#B082FF" />
                  <Bar dataKey="challenges" stackId="a" fill="#FF8A65" />
                  <Bar dataKey="practice" stackId="a" fill="#F4E76E" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {analysisType === 'insights' && (
        <div className="space-y-6">
          {/* AI-Generated Insights */}
          <div className="glass-card rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-palette-text-light mb-6 flex items-center">
              <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-2.5 rounded-xl shadow-lg mr-3">
                <Lightbulb className="h-5 w-5 text-palette-white" />
              </div>
              Smart Insights
            </h3>
            <div className="space-y-4">
              {analyticsData.insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-xl border ${
                  insight.type === 'positive' ? 'bg-palette-yellow/10 border-palette-yellow/30' :
                  insight.type === 'suggestion' ? 'bg-palette-coral/10 border-palette-coral/30' :
                  'bg-palette-medium-orchid/10 border-palette-medium-orchid/30'
                }`}>
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      insight.type === 'positive' ? 'bg-palette-yellow/20' :
                      insight.type === 'suggestion' ? 'bg-palette-coral/20' :
                      'bg-palette-medium-orchid/20'
                    }`}>
                      {insight.type === 'positive' ? <Award className="h-4 w-4 text-palette-yellow" /> :
                       insight.type === 'suggestion' ? <Target className="h-4 w-4 text-palette-coral" /> :
                       <Lightbulb className="h-4 w-4 text-palette-medium-orchid" />}
                    </div>
                    <p className="text-palette-text-light font-medium">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card rounded-2xl shadow-xl p-6">
              <h4 className="text-lg font-bold text-palette-text-light mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-palette-coral" />
                Improvement Areas
              </h4>
              <div className="space-y-3">
                <div className="p-3 glass-card-light rounded-xl">
                  <p className="text-sm font-semibold text-palette-text-light mb-1">Note Consistency</p>
                  <p className="text-xs text-palette-text-muted">Try to maintain similar note lengths across sessions for better review.</p>
                </div>
                <div className="p-3 glass-card-light rounded-xl">
                  <p className="text-sm font-semibold text-palette-text-light mb-1">Tag Organization</p>
                  <p className="text-xs text-palette-text-muted">Consider creating a tag hierarchy for better categorization.</p>
                </div>
                <div className="p-3 glass-card-light rounded-xl">
                  <p className="text-sm font-semibold text-palette-text-light mb-1">Reflection Depth</p>
                  <p className="text-xs text-palette-text-muted">Add more detailed reflections on learning challenges and solutions.</p>
                </div>
              </div>
            </div>

            <div className="glass-card rounded-2xl shadow-xl p-6">
              <h4 className="text-lg font-bold text-palette-text-light mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-palette-yellow" />
                Strengths
              </h4>
              <div className="space-y-3">
                <div className="p-3 glass-card-light rounded-xl">
                  <p className="text-sm font-semibold text-palette-text-light mb-1">Regular Documentation</p>
                  <p className="text-xs text-palette-text-muted">Excellent habit of consistent note-taking across study sessions.</p>
                </div>
                <div className="p-3 glass-card-light rounded-xl">
                  <p className="text-sm font-semibold text-palette-text-light mb-1">Detailed Practice Notes</p>
                  <p className="text-xs text-palette-text-muted">Great job documenting practice problems and solutions.</p>
                </div>
                <div className="p-3 glass-card-light rounded-xl">
                  <p className="text-sm font-semibold text-palette-text-light mb-1">Forward Planning</p>
                  <p className="text-xs text-palette-text-muted">Consistent planning for next day's focus shows good study strategy.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesAnalytics;