import React, { useState } from 'react';
import { Save, Search, Tag, Lightbulb, AlertTriangle, Target, Star, MessageSquare, Mic } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

interface NotesManagerProps {
  selectedDate: string;
}

const NotesManager: React.FC<NotesManagerProps> = ({ selectedDate }) => {
  const { schedule, updateDayProgress } = useStudy();
  const [searchTerm, setSearchTerm] = useState('');
  const [newTag, setNewTag] = useState('');

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

  const notesSections = [
    {
      id: 'conceptsLearned',
      title: 'Concepts Learned',
      icon: Lightbulb,
      placeholder: 'Key concepts and formulas understood today...',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'difficultiesFaced',
      title: 'Difficulties Faced',
      icon: AlertTriangle,
      placeholder: 'Topics that were challenging or confusing...',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      id: 'practiceProblems',
      title: 'Practice Problems',
      icon: Target,
      placeholder: 'Record of problems solved, mistakes made...',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'resourceFeedback',
      title: 'Resource Feedback',
      icon: Star,
      placeholder: 'Rating and feedback on study materials used...',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      id: 'tomorrowFocus',
      title: "Tomorrow's Focus",
      icon: Target,
      placeholder: 'Plan for next day based on today\'s progress...',
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      id: 'quickNotes',
      title: 'Quick Notes',
      icon: MessageSquare,
      placeholder: 'Quick thoughts, insights, or reminders...',
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Search and Tags Section */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Tag className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {dayData.notes.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 cursor-pointer"
                onClick={() => handleTagRemove(tag)}
              >
                {tag}
                <span className="ml-1 text-blue-600 dark:text-blue-300">×</span>
              </span>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTagAdd()}
                className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleTagAdd}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notes Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {notesSections.map(({ id, title, icon: Icon, placeholder, color }) => (
          <div key={id} className="space-y-3">
            <div className="flex items-center space-x-2">
              <Icon className={`h-5 w-5 ${color}`} />
              <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
            </div>
            <textarea
              value={dayData.notes[id as keyof typeof dayData.notes] as string}
              onChange={(e) => handleNotesUpdate(id as keyof typeof dayData.notes, e.target.value)}
              placeholder={placeholder}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        ))}
      </div>

      {/* Voice Notes and Media Section */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <Mic className="h-4 w-4 mr-2" />
          Voice Notes & Media
        </h4>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Voice recording and image upload features coming soon...
        </div>
      </div>

      {/* Save Status */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
          <Save className="h-4 w-4" />
          <span>All changes saved automatically</span>
        </div>
      </div>
    </div>
  );
};

export default NotesManager;