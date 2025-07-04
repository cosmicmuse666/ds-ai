import React, { useState } from 'react';
import { ChevronRight, Clock, CheckCircle2, Circle, Calendar, BookOpen, Plus, X, Edit3, Trash2 } from 'lucide-react';
import { format, addDays, isToday, isTomorrow, isYesterday } from 'date-fns';
import { useStudy } from '../context/StudyContext';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: 'study' | 'personal' | 'work' | 'other';
}

const StudyPreviewPanel: React.FC = () => {
  const { schedule, setSelectedDate, setCurrentView, updateDayProgress } = useStudy();
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const [todos, setTodos] = useState<TodoItem[]>([
    {
      id: '1',
      text: 'Review Linear Algebra notes',
      completed: false,
      priority: 'high',
      category: 'study',
      dueDate: new Date().toISOString().split('T')[0]
    },
    {
      id: '2',
      text: 'Complete practice problems',
      completed: true,
      priority: 'medium',
      category: 'study'
    },
    {
      id: '3',
      text: 'Prepare for mock test',
      completed: false,
      priority: 'high',
      category: 'study',
      dueDate: addDays(new Date(), 2).toISOString().split('T')[0]
    }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [selectedCategory, setSelectedCategory] = useState<'study' | 'personal' | 'work' | 'other'>('study');

  // Generate 7-day rolling timeline starting from today
  const today = new Date();
  const timelineDays = Array.from({ length: 7 }, (_, i) => addDays(today, i));

  const getSubjectColor = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      'Linear Algebra': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid',
      'Calculus': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid',
      'Probability': 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      'Statistics': 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      'Python': 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      'Data Structures': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'Algorithms': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'Machine Learning': 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid',
      'AI': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'DBMS': 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      'Review': 'bg-palette-text-muted/20 border-palette-text-muted/40 text-palette-text-muted',
      'Mock Tests': 'bg-palette-text-muted/20 border-palette-text-muted/40 text-palette-text-muted'
    };
    return colorMap[subject] || 'bg-palette-text-muted/20 border-palette-text-muted/40 text-palette-text-muted';
  };

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    const colors = {
      high: 'bg-palette-coral/20 border-palette-coral/40 text-palette-coral',
      medium: 'bg-palette-yellow/20 border-palette-yellow/40 text-palette-yellow',
      low: 'bg-palette-medium-orchid/20 border-palette-medium-orchid/40 text-palette-medium-orchid'
    };
    return colors[priority];
  };

  const getCategoryColor = (category: 'study' | 'personal' | 'work' | 'other') => {
    const colors = {
      study: 'bg-palette-medium-orchid/20 text-palette-medium-orchid',
      personal: 'bg-palette-yellow/20 text-palette-yellow',
      work: 'bg-palette-coral/20 text-palette-coral',
      other: 'bg-palette-text-muted/20 text-palette-text-muted'
    };
    return colors[category];
  };

  const getDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEE, MMM d');
  };

  const handleTopicClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setCurrentView('daily');
  };

  const handleQuickComplete = (date: Date, e: React.MouseEvent) => {
    e.stopPropagation();
    const dateStr = date.toISOString().split('T')[0];
    const dayData = schedule[dateStr];
    
    if (dayData) {
      const newCompleted = dayData.progress.completionPercentage === 100 ? 0 : dayData.tasks.length;
      updateDayProgress(dateStr, {
        progress: {
          ...dayData.progress,
          tasksCompleted: newCompleted,
          completionPercentage: Math.round((newCompleted / dayData.tasks.length) * 100)
        }
      });
    }
  };

  const toggleDayExpansion = (dateStr: string) => {
    setExpandedDay(expandedDay === dateStr ? null : dateStr);
  };

  const addTodo = () => {
    if (newTodo.trim()) {
      const todo: TodoItem = {
        id: Date.now().toString(),
        text: newTodo.trim(),
        completed: false,
        priority: selectedPriority,
        category: selectedCategory
      };
      setTodos(prev => [todo, ...prev]);
      setNewTodo('');
      setShowAddTodo(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="w-96 space-y-8">
      {/* Study Timeline */}
      <div className="glass-card rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-palette-medium-orchid/20 bg-gradient-to-r from-palette-medium-orchid/10 to-palette-yellow/10">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-yellow p-3 rounded-xl">
              <Calendar className="h-6 w-6 text-palette-primary-black" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-palette-text-light">Study Timeline</h3>
              <p className="text-sm text-palette-text-muted">7-day preview</p>
            </div>
          </div>
        </div>

        {/* Timeline Content */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-4">
            {timelineDays.map((date) => {
              const dateStr = date.toISOString().split('T')[0];
              const dayData = schedule[dateStr];
              const isExpanded = expandedDay === dateStr;
              
              if (!dayData) {
                return (
                  <div key={dateStr} className="p-4 glass-card-light rounded-xl border border-palette-text-muted/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-palette-text-light">
                          {getDateLabel(date)}
                        </p>
                        <p className="text-xs text-palette-text-muted">No study scheduled</p>
                      </div>
                      <div className="w-3 h-3 bg-palette-text-muted/40 rounded-full"></div>
                    </div>
                  </div>
                );
              }

              return (
                <div key={dateStr} className="space-y-3">
                  {/* Day Header */}
                  <div 
                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      isToday(date) 
                        ? 'bg-palette-medium-orchid/10 border-palette-medium-orchid/30 shadow-purple' 
                        : 'glass-card-light border-palette-medium-orchid/20 hover:bg-palette-bg-light'
                    }`}
                    onClick={() => toggleDayExpansion(dateStr)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <p className={`text-sm font-bold ${
                            isToday(date) ? 'text-palette-medium-orchid' : 'text-palette-text-light'
                          }`}>
                            {getDateLabel(date)}
                          </p>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={(e) => handleQuickComplete(date, e)}
                              className={`p-1.5 rounded-full transition-all duration-200 hover:scale-110 ${
                                dayData.progress.completionPercentage === 100
                                  ? 'text-palette-yellow hover:text-palette-yellow-bright'
                                  : 'text-palette-text-muted hover:text-palette-medium-orchid'
                              }`}
                            >
                              {dayData.progress.completionPercentage === 100 ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <Circle className="h-5 w-5" />
                              )}
                            </button>
                            <ChevronRight className={`h-5 w-5 text-palette-text-muted transition-transform duration-200 ${
                              isExpanded ? 'rotate-90' : ''
                            }`} />
                          </div>
                        </div>
                        
                        {/* Subject Badge */}
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border ${getSubjectColor(dayData.subject)}`}>
                          <BookOpen className="h-3 w-3 mr-2" />
                          {dayData.subject}
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center space-x-2 text-xs text-palette-text-muted">
                            <Clock className="h-3 w-3" />
                            <span>{dayData.plannedHours}h planned</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="w-16 bg-palette-bg-darker rounded-full h-2 overflow-hidden">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  dayData.progress.completionPercentage === 100 
                                    ? 'bg-gradient-to-r from-palette-yellow to-palette-yellow-bright' 
                                    : dayData.progress.completionPercentage >= 50 
                                      ? 'bg-gradient-to-r from-palette-medium-orchid to-palette-light-violet' 
                                      : 'bg-gradient-to-r from-palette-coral to-palette-coral-light'
                                }`}
                                style={{ width: `${dayData.progress.completionPercentage}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-palette-text-muted">
                              {dayData.progress.completionPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="ml-6 space-y-3 animate-fade-in">
                      <div className="p-4 glass-card-light rounded-xl border border-palette-medium-orchid/20">
                        <h5 className="text-sm font-semibold text-palette-text-light mb-3 flex items-center">
                          <span className="w-2 h-2 bg-palette-medium-orchid rounded-full mr-3"></span>
                          Tasks ({dayData.progress.tasksCompleted}/{dayData.tasks.length})
                        </h5>
                        <div className="space-y-2">
                          {dayData.tasks.slice(0, 3).map((task, index) => (
                            <div key={index} className="flex items-center space-x-3">
                              <div className={`w-2 h-2 rounded-full ${
                                index < dayData.progress.tasksCompleted 
                                  ? 'bg-palette-yellow' 
                                  : 'bg-palette-text-muted/40'
                              }`} />
                              <span className={`text-xs ${
                                index < dayData.progress.tasksCompleted 
                                  ? 'text-palette-text-muted line-through' 
                                  : 'text-palette-text-light'
                              }`}>
                                {task.length > 35 ? task.substring(0, 35) + '...' : task}
                              </span>
                            </div>
                          ))}
                          {dayData.tasks.length > 3 && (
                            <p className="text-xs text-palette-text-muted ml-5">
                              +{dayData.tasks.length - 3} more tasks
                            </p>
                          )}
                        </div>
                        
                        <button
                          onClick={() => handleTopicClick(date)}
                          className="w-full mt-4 btn-primary text-xs py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-palette-medium-orchid/20 bg-gradient-to-r from-palette-bg-darker/50 to-palette-bg-light/50">
          <div className="flex items-center justify-between text-xs text-palette-text-muted">
            <span>Click to expand details</span>
            <div className="flex items-center space-x-2">
              <Circle className="h-3 w-3" />
              <span>Quick complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* To-Do List */}
      <div className="glass-card rounded-3xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-palette-medium-orchid/20 bg-gradient-to-r from-palette-coral/10 to-palette-yellow/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-palette-coral to-palette-yellow p-3 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-palette-primary-black" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-palette-text-light">To-Do List</h3>
                <p className="text-sm text-palette-text-muted">
                  {pendingTodos.length} pending, {completedTodos.length} completed
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddTodo(!showAddTodo)}
              className="btn-primary p-3 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Add Todo Form */}
        {showAddTodo && (
          <div className="p-6 border-b border-palette-medium-orchid/20 bg-palette-bg-darker/30 animate-fade-in">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                className="w-full px-4 py-3 border border-palette-medium-orchid/30 rounded-xl bg-palette-bg-darker text-palette-text-light placeholder-palette-text-muted focus:ring-2 focus:ring-palette-medium-orchid focus:border-transparent"
                autoFocus
              />
              
              <div className="flex items-center space-x-3">
                <select
                  value={selectedPriority}
                  onChange={(e) => setSelectedPriority(e.target.value as 'high' | 'medium' | 'low')}
                  className="px-3 py-2 border border-palette-medium-orchid/30 rounded-lg bg-palette-bg-darker text-palette-text-light text-sm focus:ring-2 focus:ring-palette-medium-orchid"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as 'study' | 'personal' | 'work' | 'other')}
                  className="px-3 py-2 border border-palette-medium-orchid/30 rounded-lg bg-palette-bg-darker text-palette-text-light text-sm focus:ring-2 focus:ring-palette-medium-orchid"
                >
                  <option value="study">Study</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-3">
                <button
                  onClick={addTodo}
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
                >
                  Add Task
                </button>
                <button
                  onClick={() => setShowAddTodo(false)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-palette-text-muted hover:text-palette-text-light hover:bg-palette-bg-light transition-all duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Todo List Content */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          <div className="p-6 space-y-4">
            {/* Pending Todos */}
            {pendingTodos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-palette-text-light flex items-center">
                  <span className="w-2 h-2 bg-palette-coral rounded-full mr-3"></span>
                  Pending ({pendingTodos.length})
                </h4>
                {pendingTodos.map((todo) => (
                  <div key={todo.id} className="group p-4 glass-card-light rounded-xl border border-palette-medium-orchid/20 hover:bg-palette-bg-light transition-all duration-200">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 text-palette-text-muted hover:text-palette-medium-orchid transition-colors"
                      >
                        <Circle className="h-5 w-5" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-palette-text-light mb-2">
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(todo.priority)}`}>
                            {todo.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(todo.category)}`}>
                            {todo.category}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-palette-text-muted hover:text-palette-coral hover:bg-palette-coral/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Completed Todos */}
            {completedTodos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-palette-text-light flex items-center">
                  <span className="w-2 h-2 bg-palette-yellow rounded-full mr-3"></span>
                  Completed ({completedTodos.length})
                </h4>
                {completedTodos.map((todo) => (
                  <div key={todo.id} className="group p-4 glass-card-light rounded-xl border border-palette-yellow/20 bg-palette-yellow/5">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className="mt-0.5 text-palette-yellow hover:text-palette-yellow-bright transition-colors"
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-palette-text-muted line-through mb-2">
                          {todo.text}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-palette-text-muted/20 text-palette-text-muted border border-palette-text-muted/40">
                            {todo.priority}
                          </span>
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-palette-text-muted/20 text-palette-text-muted">
                            {todo.category}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-palette-text-muted hover:text-palette-coral hover:bg-palette-coral/20 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {todos.length === 0 && (
              <div className="text-center py-8">
                <div className="bg-gradient-to-r from-palette-medium-orchid to-palette-coral p-4 rounded-2xl w-fit mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-palette-white" />
                </div>
                <h4 className="text-lg font-bold text-palette-text-light mb-2">
                  No tasks yet
                </h4>
                <p className="text-palette-text-muted mb-4">
                  Add your first task to get started!
                </p>
                <button
                  onClick={() => setShowAddTodo(true)}
                  className="btn-primary px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                >
                  Add Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPreviewPanel;