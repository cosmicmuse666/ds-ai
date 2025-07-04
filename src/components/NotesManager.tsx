import React, { useState, useRef } from 'react';
import { Save, Search, Tag, Lightbulb, AlertTriangle, Target, Star, MessageSquare, Mic, Plus, X, Volume2, Camera, Image, Palette, Brain, Zap, BookOpen, TrendingUp, Eye, EyeOff } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import VoiceRecorder from './VoiceRecorder';
import NotesAnalytics from './NotesAnalytics';

interface VoiceNote {
  id: string;
  timestamp: Date;
  duration: number;
  audioBlob: Blob;
  transcription?: string;
  summary?: string;
  isProcessing?: boolean;
}

interface NotesManagerProps {
  selectedDate: string;
}

const NotesManager: React.FC<NotesManagerProps> = ({ selectedDate }) => {
  const { schedule, updateDayProgress } = useStudy();
  const [searchTerm, setSearchTerm] = useState('');
  const [newTag, setNewTag] = useState('');
  const [activeTab, setActiveTab] = useState<'written' | 'voice' | 'analytics'>('written');
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);
  const [focusMode, setFocusMode] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const dayData = schedule[selectedDate];
  if (!dayData) return null;

  const handleNotesUpdate = (field: keyof typeof dayData.notes, value: string) => {
    updateDayProgress(selectedDate, {
      notes: {
        ...dayData.notes,
        [field]: value
      }
    });
  };

  const handleTagAdd = () => {
    if (newTag.trim() && !dayData.notes.tags.includes(newTag.trim())) {
      updateDayProgress(selectedDate, {
        notes: {
          ...dayData.notes,
          tags: [...dayData.notes.tags, newTag.trim()]
        }
      });
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    updateDayProgress(selectedDate, {
      notes: {
        ...dayData.notes,
        tags: dayData.notes.tags.filter(tag => tag !== tagToRemove)
      }
    });
  };

  const handleVoiceNoteAdded = (voiceNote: VoiceNote) => {
    setVoiceNotes(prev => {
      const existingIndex = prev.findIndex(note => note.id === voiceNote.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = voiceNote;
        return updated;
      } else {
        return [voiceNote, ...prev];
      }
    });
  };

  const handleVoiceNoteDeleted = (id: string) => {
    setVoiceNotes(prev => prev.filter(note => note.id !== id));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you'd upload these to a server and get URLs
      const imageUrls = Array.from(files).map(file => URL.createObjectURL(file));
      updateDayProgress(selectedDate, {
        notes: {
          ...dayData.notes,
          images: [...dayData.notes.images, ...imageUrls]
        }
      });
    }
  };

  const applyTemplate = (templateId: string) => {
    const templates = {
      'concept-review': {
        conceptsLearned: '🧠 Key Concepts:\n• \n• \n• \n\n🔗 Connections:\n• \n• ',
        difficultiesFaced: '⚠️ Challenges:\n• \n\n💡 Solutions Tried:\n• \n• ',
        practiceProblems: '📝 Problems Solved:\n1. \n2. \n3. \n\n❌ Mistakes Made:\n• \n• ',
        tomorrowFocus: '🎯 Tomorrow\'s Goals:\n• \n• \n• '
      },
      'deep-dive': {
        conceptsLearned: '🔍 Deep Dive Topic: \n\n📚 What I Learned:\n• \n• \n• \n\n🌟 Breakthrough Moments:\n• ',
        difficultiesFaced: '🧩 Complex Areas:\n• \n\n🔄 Need More Practice:\n• \n• ',
        resourceFeedback: '📖 Resources Used:\n• Book/Video: ⭐⭐⭐⭐⭐\n• Practice: ⭐⭐⭐⭐⭐\n\n💭 Notes:\n'
      },
      'quick-session': {
        conceptsLearned: '⚡ Quick Session Summary:\n• \n• ',
        practiceProblems: '🏃‍♂️ Problems Tackled:\n• \n• ',
        quickNotes: '💭 Quick Thoughts:\n• \n• '
      }
    };

    const template = templates[templateId as keyof typeof templates];
    if (template) {
      Object.entries(template).forEach(([field, value]) => {
        handleNotesUpdate(field as keyof typeof dayData.notes, value);
      });
      setSelectedTemplate(null);
    }
  };

  const notesSections = [
    {
      id: 'conceptsLearned',
      title: 'Concepts Learned',
      icon: Brain,
      placeholder: 'What new concepts did you master today? Include formulas, theories, or key insights...',
      gradient: 'from-palette-medium-orchid to-palette-light-violet',
      bgColor: 'from-palette-medium-orchid/10 to-palette-medium-orchid/5',
      tips: ['Use bullet points for clarity', 'Include examples', 'Connect to previous knowledge']
    },
    {
      id: 'difficultiesFaced',
      title: 'Challenges & Solutions',
      icon: AlertTriangle,
      placeholder: 'What was challenging? How did you overcome it? What strategies worked?',
      gradient: 'from-palette-coral to-palette-coral-light',
      bgColor: 'from-palette-coral/10 to-palette-coral/5',
      tips: ['Be specific about problems', 'Document solution attempts', 'Note what to review']
    },
    {
      id: 'practiceProblems',
      title: 'Practice & Application',
      icon: Target,
      placeholder: 'Record problems solved, coding exercises, or practical applications...',
      gradient: 'from-palette-yellow to-palette-yellow-bright',
      bgColor: 'from-palette-yellow/10 to-palette-yellow/5',
      tips: ['Include problem numbers', 'Note time taken', 'Mark difficulty level']
    },
    {
      id: 'resourceFeedback',
      title: 'Resource Evaluation',
      icon: Star,
      placeholder: 'Rate and review books, videos, courses, or websites used today...',
      gradient: 'from-palette-coral to-palette-yellow',
      bgColor: 'from-palette-coral/10 to-palette-yellow/5',
      tips: ['Rate out of 5 stars', 'Note best sections', 'Compare resources']
    },
    {
      id: 'tomorrowFocus',
      title: "Tomorrow's Strategy",
      icon: TrendingUp,
      placeholder: 'Based on today\'s progress, what should you focus on tomorrow?',
      gradient: 'from-palette-medium-orchid to-palette-coral',
      bgColor: 'from-palette-medium-orchid/10 to-palette-coral/5',
      tips: ['Set specific goals', 'Prioritize weak areas', 'Plan time allocation']
    },
    {
      id: 'quickNotes',
      title: 'Quick Insights',
      icon: Zap,
      placeholder: 'Rapid thoughts, eureka moments, or random insights...',
      gradient: 'from-palette-yellow to-palette-coral',
      bgColor: 'from-palette-yellow/10 to-palette-coral/5',
      tips: ['Capture fleeting thoughts', 'Note patterns', 'Record inspiration']
    }
  ];

  const tabs = [
    { id: 'written', label: 'Smart Notes', icon: Brain },
    { id: 'voice', label: 'Voice Notes', icon: Volume2 },
    { id: 'analytics', label: 'Insights', icon: BookOpen }
  ];

  const templates = [
    { id: 'concept-review', name: 'Concept Review', icon: Brain, description: 'Structured learning session' },
    { id: 'deep-dive', name: 'Deep Dive', icon: Lightbulb, description: 'Intensive topic exploration' },
    { id: 'quick-session', name: 'Quick Session', icon: Zap, description: 'Short study burst' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Tab Navigation with Focus Mode */}
      <div className="flex items-center justify-between">
        <nav className="flex space-x-2 glass-card-light rounded-2xl p-1.5 backdrop-blur-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'written' | 'voice' | 'analytics')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'btn-primary shadow-purple'
                  : 'text-palette-text-light/80 hover:bg-palette-medium-orchid/20 hover:text-palette-medium-orchid'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
              {id === 'voice' && voiceNotes.length > 0 && (
                <span className="bg-palette-medium-orchid text-palette-primary-black text-xs px-2 py-1 rounded-full">
                  {voiceNotes.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setFocusMode(!focusMode)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${
              focusMode
                ? 'bg-palette-medium-orchid/20 border-palette-medium-orchid/30 text-palette-medium-orchid'
                : 'bg-palette-bg-light/50 border-palette-text-muted/20 text-palette-text-muted hover:text-palette-text-light'
            } border`}
          >
            {focusMode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            <span>{focusMode ? 'Exit Focus' : 'Focus Mode'}</span>
          </button>
        </div>
      </div>

      {activeTab === 'written' && (
        <>
          {/* Smart Templates */}
          {!focusMode && (
            <div className="bg-gradient-to-br from-palette-medium-orchid/10 to-palette-yellow/10 rounded-2xl p-6 border border-palette-medium-orchid/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-2 rounded-lg">
                    <Palette className="h-4 w-4 text-palette-primary-black" />
                  </div>
                  <span className="text-sm font-bold text-palette-text-light">Smart Templates</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {templates.map(({ id, name, icon: Icon, description }) => (
                  <button
                    key={id}
                    onClick={() => applyTemplate(id)}
                    className="p-4 glass-card-light rounded-xl border border-palette-medium-orchid/20 hover:bg-palette-bg-light transition-all duration-200 hover:scale-105 text-left group"
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <Icon className="h-5 w-5 text-palette-medium-orchid group-hover:text-palette-light-violet transition-colors" />
                      <span className="font-semibold text-palette-text-light text-sm">{name}</span>
                    </div>
                    <p className="text-xs text-palette-text-muted">{description}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Search and Tags Section */}
          {!focusMode && (
            <div className="bg-gradient-to-br from-palette-medium-orchid/10 to-palette-yellow/10 rounded-2xl p-6 border border-palette-medium-orchid/20">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-light/50" />
                  <input
                    type="text"
                    placeholder="Search through your notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-light/50 focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200"
                  />
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-secondary flex items-center space-x-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Camera className="h-4 w-4" />
                  <span>Add Image</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-2 rounded-lg">
                    <Tag className="h-4 w-4 text-palette-primary-black" />
                  </div>
                  <span className="text-sm font-bold text-palette-text-light">Smart Tags & Labels</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {dayData.notes.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="group inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-palette-medium-orchid to-palette-coral text-palette-white cursor-pointer hover:from-palette-light-violet hover:to-palette-coral-light transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                      onClick={() => handleTagRemove(tag)}
                    >
                      {tag}
                      <X className="ml-2 h-3 w-3 opacity-70 group-hover:opacity-100 transition-opacity" />
                    </span>
                  ))}
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="Add new tag..."
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                      className="px-3 py-2 text-sm border border-palette-medium-orchid/30 rounded-lg bg-palette-bg-darker text-palette-text-light focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent"
                    />
                    <button
                      onClick={handleTagAdd}
                      className="btn-primary flex items-center space-x-1 px-3 py-2 text-sm rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              {dayData.notes.images.length > 0 && (
                <div className="mt-6">
                  <h5 className="text-sm font-bold text-palette-text-light mb-3 flex items-center">
                    <Image className="h-4 w-4 mr-2" />
                    Attached Images ({dayData.notes.images.length})
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dayData.notes.images.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Note attachment ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-palette-medium-orchid/20"
                        />
                        <button
                          onClick={() => {
                            updateDayProgress(selectedDate, {
                              notes: {
                                ...dayData.notes,
                                images: dayData.notes.images.filter((_, i) => i !== index)
                              }
                            });
                          }}
                          className="absolute top-1 right-1 p-1 bg-palette-coral/80 text-palette-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-palette-coral"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Enhanced Notes Sections */}
          <div className={`grid grid-cols-1 ${focusMode ? 'lg:grid-cols-1' : 'lg:grid-cols-2'} gap-8`}>
            {notesSections.map(({ id, title, icon: Icon, placeholder, gradient, bgColor, tips }) => (
              <div key={id} className={`bg-gradient-to-br ${bgColor} rounded-2xl p-6 border border-palette-medium-orchid/20 hover:shadow-lg transition-all duration-300 ${focusMode ? 'lg:col-span-1' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`bg-gradient-to-r ${gradient} p-2.5 rounded-xl shadow-lg`}>
                      <Icon className="h-5 w-5 text-palette-primary-black" />
                    </div>
                    <h4 className="font-bold text-palette-text-light">{title}</h4>
                  </div>
                  
                  {!focusMode && (
                    <div className="group relative">
                      <button className="p-2 rounded-lg text-palette-text-muted hover:text-palette-text-light hover:bg-palette-medium-orchid/20 transition-all duration-200">
                        <Lightbulb className="h-4 w-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-2 w-64 p-3 glass-card rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                        <h6 className="text-xs font-semibold text-palette-text-light mb-2">💡 Tips:</h6>
                        <ul className="text-xs text-palette-text-muted space-y-1">
                          {tips.map((tip, index) => (
                            <li key={index} className="flex items-start space-x-2">
                              <span className="w-1 h-1 bg-palette-medium-orchid rounded-full mt-1.5 flex-shrink-0"></span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                
                <textarea
                  value={dayData.notes[id as keyof typeof dayData.notes] as string}
                  onChange={(e) => handleNotesUpdate(id as keyof typeof dayData.notes, e.target.value)}
                  placeholder={placeholder}
                  rows={focusMode ? 12 : 6}
                  className="w-full px-4 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-light/50 resize-none focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
                
                {/* Character count and word count */}
                <div className="flex justify-between items-center mt-2 text-xs text-palette-text-muted">
                  <span>
                    {(dayData.notes[id as keyof typeof dayData.notes] as string).split(' ').filter(word => word.length > 0).length} words
                  </span>
                  <span>
                    {(dayData.notes[id as keyof typeof dayData.notes] as string).length} characters
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'voice' && (
        <VoiceRecorder
          onVoiceNoteAdded={handleVoiceNoteAdded}
          voiceNotes={voiceNotes}
          onVoiceNoteDeleted={handleVoiceNoteDeleted}
        />
      )}

      {activeTab === 'analytics' && (
        <NotesAnalytics selectedDate={selectedDate} />
      )}

      {/* Enhanced Save Status */}
      <div className="flex items-center justify-between pt-6 border-t border-palette-medium-orchid/20">
        <div className="flex items-center space-x-3 text-palette-yellow">
          <div className="bg-palette-yellow/20 p-2 rounded-lg">
            <Save className="h-4 w-4" />
          </div>
          <span className="font-medium">All changes saved automatically</span>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-palette-text-muted">
          <span>
            {Object.values(dayData.notes).join(' ').split(' ').filter(word => word.length > 0).length} total words
          </span>
          <span>•</span>
          <span>
            {dayData.notes.tags.length} tags
          </span>
          <span>•</span>
          <span>
            {voiceNotes.length} voice notes
          </span>
        </div>
      </div>
    </div>
  );
};

export default NotesManager;