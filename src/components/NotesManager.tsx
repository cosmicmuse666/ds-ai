import React, { useState } from 'react';
import { Save, Search, Tag, Lightbulb, AlertTriangle, Target, Star, MessageSquare, Mic, Plus, X, Volume2 } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import VoiceRecorder from './VoiceRecorder';

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
  const [activeTab, setActiveTab] = useState<'written' | 'voice'>('written');
  const [voiceNotes, setVoiceNotes] = useState<VoiceNote[]>([]);

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
        // Update existing note
        const updated = [...prev];
        updated[existingIndex] = voiceNote;
        return updated;
      } else {
        // Add new note
        return [voiceNote, ...prev];
      }
    });
  };

  const handleVoiceNoteDeleted = (id: string) => {
    setVoiceNotes(prev => prev.filter(note => note.id !== id));
  };

  const notesSections = [
    {
      id: 'conceptsLearned',
      title: 'Concepts Learned',
      icon: Lightbulb,
      placeholder: 'Key concepts and formulas understood today...',
      gradient: 'from-palette-yellow to-palette-yellow-bright',
      bgColor: 'from-palette-yellow/10 to-palette-yellow/5'
    },
    {
      id: 'difficultiesFaced',
      title: 'Difficulties Faced',
      icon: AlertTriangle,
      placeholder: 'Topics that were challenging or confusing...',
      gradient: 'from-palette-coral to-palette-coral-light',
      bgColor: 'from-palette-coral/10 to-palette-coral/5'
    },
    {
      id: 'practiceProblems',
      title: 'Practice Problems',
      icon: Target,
      placeholder: 'Record of problems solved, mistakes made...',
      gradient: 'from-palette-purple to-palette-purple-dark',
      bgColor: 'from-palette-purple/10 to-palette-purple/5'
    },
    {
      id: 'resourceFeedback',
      title: 'Resource Feedback',
      icon: Star,
      placeholder: 'Rating and feedback on study materials used...',
      gradient: 'from-palette-purple to-palette-coral',
      bgColor: 'from-palette-purple/10 to-palette-coral/5'
    },
    {
      id: 'tomorrowFocus',
      title: "Tomorrow's Focus",
      icon: Target,
      placeholder: 'Plan for next day based on today\'s progress...',
      gradient: 'from-palette-coral to-palette-yellow',
      bgColor: 'from-palette-coral/10 to-palette-yellow/5'
    },
    {
      id: 'quickNotes',
      title: 'Quick Notes',
      icon: MessageSquare,
      placeholder: 'Quick thoughts, insights, or reminders...',
      gradient: 'from-palette-btn-gray to-palette-btn-gray-dark',
      bgColor: 'from-palette-btn-gray/10 to-palette-btn-gray/5'
    }
  ];

  const tabs = [
    { id: 'written', label: 'Written Notes', icon: MessageSquare },
    { id: 'voice', label: 'Voice Notes', icon: Volume2 }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Enhanced Tab Navigation */}
      <div className="flex items-center justify-between">
        <nav className="flex space-x-2 glass-card-light rounded-2xl p-1.5 backdrop-blur-sm">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as 'written' | 'voice')}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'btn-primary shadow-purple'
                  : 'text-palette-text-light/80 hover:bg-palette-purple/20 hover:text-palette-purple'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm">{label}</span>
              {id === 'voice' && voiceNotes.length > 0 && (
                <span className="bg-palette-purple text-palette-dark text-xs px-2 py-1 rounded-full">
                  {voiceNotes.length}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'written' && (
        <>
          {/* Enhanced Search and Tags Section */}
          <div className="bg-gradient-to-br from-palette-purple/10 to-palette-yellow/10 rounded-2xl p-6 border border-palette-purple/20">
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-palette-text-light/50" />
                <input
                  type="text"
                  placeholder="Search through your notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-palette-purple/30 rounded-xl bg-palette-dark text-palette-text-light placeholder-palette-text-light/50 focus:ring-2 focus:ring-palette-purple focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-palette-purple to-palette-yellow p-2 rounded-lg">
                  <Tag className="h-4 w-4 text-palette-dark" />
                </div>
                <span className="text-sm font-bold text-palette-text-light">Tags & Labels</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {dayData.notes.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="group inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-palette-purple to-palette-coral text-palette-white cursor-pointer hover:from-palette-purple-dark hover:to-palette-coral-light transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
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
                    className="px-3 py-2 text-sm border border-palette-purple/30 rounded-lg bg-palette-dark text-palette-text-light focus:ring-2 focus:ring-palette-purple focus:border-transparent"
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
          </div>

          {/* Enhanced Notes Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {notesSections.map(({ id, title, icon: Icon, placeholder, gradient, bgColor }) => (
              <div key={id} className={`bg-gradient-to-br ${bgColor} rounded-2xl p-6 border border-palette-purple/20 hover:shadow-lg transition-all duration-300`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`bg-gradient-to-r ${gradient} p-2.5 rounded-xl shadow-lg`}>
                    <Icon className="h-5 w-5 text-palette-dark" />
                  </div>
                  <h4 className="font-bold text-palette-text-light">{title}</h4>
                </div>
                <textarea
                  value={dayData.notes[id as keyof typeof dayData.notes] as string}
                  onChange={(e) => handleNotesUpdate(id as keyof typeof dayData.notes, e.target.value)}
                  placeholder={placeholder}
                  rows={6}
                  className="w-full px-4 py-3 border border-palette-purple/30 rounded-xl bg-palette-dark text-palette-text-light placeholder-palette-text-light/50 resize-none focus:ring-2 focus:ring-palette-purple focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                />
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

      {/* Enhanced Save Status */}
      <div className="flex items-center justify-between pt-6 border-t border-palette-purple/20">
        <div className="flex items-center space-x-3 text-palette-yellow">
          <div className="bg-palette-yellow/20 p-2 rounded-lg">
            <Save className="h-4 w-4" />
          </div>
          <span className="font-medium">All changes saved automatically</span>
        </div>
      </div>
    </div>
  );
};

export default NotesManager;