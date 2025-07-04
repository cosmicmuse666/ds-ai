import React, { useState } from 'react';
import { Plus, X, CheckCircle2, Circle, Trash2 } from 'lucide-react';

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
  category: 'study' | 'personal' | 'work' | 'other';
}

const TodoListPanel: React.FC = () => {
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
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    {
      id: '4',
      text: 'Buy groceries',
      completed: false,
      priority: 'low',
      category: 'personal'
    },
    {
      id: '5',
      text: 'Schedule dentist appointment',
      completed: true,
      priority: 'medium',
      category: 'personal'
    }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [showAddTodo, setShowAddTodo] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [selectedCategory, setSelectedCategory] = useState<'study' | 'personal' | 'work' | 'other'>('study');

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
    <div className="glass-card rounded-3xl shadow-xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-palette-medium-orchid/20 bg-gradient-to-r from-palette-coral/10 to-palette-yellow/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-palette-coral to-palette-yellow p-3 rounded-xl">
              <CheckCircle2 className="h-6 w-6 text-palette-primary-black" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-palette-text-light">To-Do List</h3>
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
      <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
        <div className="p-6 space-y-6">
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
            <div className="text-center py-12">
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
  );
};

export default TodoListPanel;