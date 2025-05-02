import React, { useState } from 'react';
import { Log } from '../../models/Log';
import { useTheme } from '../../contexts/ThemeContext';

interface ManualLogFormProps {
  onSubmit: (log: Pick<Log, 'timeStudied' | 'topics' | 'confidence' | 'date'>) => void;
  onCancel: () => void;
}

const ManualLogForm: React.FC<ManualLogFormProps> = ({ onSubmit, onCancel }) => {
  const { theme } = useTheme();
  const [topics, setTopics] = useState<string>('');
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [confidence, setConfidence] = useState<number>(5);
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total minutes
    const totalMinutes = (hours * 60) + minutes;
    
    if (totalMinutes < 1) {
      alert('Please add at least 1 minute of study time.');
      return;
    }
    
    // Parse topics from the comma-separated input
    const topicsList = topics
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');
    
    // Create and submit the log
    onSubmit({
      timeStudied: totalMinutes,
      topics: topicsList.length > 0 ? topicsList : ['Study Session'],
      confidence,
      date
    });
  };

  // Get confidence level text based on the value
  const getConfidenceText = () => {
    if (confidence <= 3) return 'Low';
    if (confidence <= 7) return 'Medium';
    return 'High';
  };

  // Get confidence level color based on the value
  const getConfidenceColor = () => {
    if (confidence <= 3) return 'from-red-500 to-orange-400';
    if (confidence <= 7) return 'from-yellow-400 to-amber-500';
    return 'from-green-400 to-emerald-500';
  };

  return (
    <div className="card p-6 transition-all animate-fadeIn">
      <h2 className="text-xl font-bold mb-4 text-[var(--text-primary)]">Log Study Session</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-[var(--text-secondary)]">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </div>
        
        <div className="transition-all duration-200">
          <label htmlFor="topics" className="block text-sm font-medium text-[var(--text-secondary)]">
            Topics (comma separated)
          </label>
          <input
            type="text"
            id="topics"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="input"
            placeholder="React, TypeScript, CSS"
          />
        </div>
        
        <div className="transition-all duration-200">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Time Studied
          </label>
          <div className="flex space-x-3">
            <div className="w-1/2">
              <label htmlFor="hours" className="block text-xs text-[var(--text-secondary)]">
                Hours
              </label>
              <input
                type="number"
                id="hours"
                min="0"
                max="24"
                value={hours}
                onChange={(e) => setHours(Math.max(0, parseInt(e.target.value) || 0))}
                className="input"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="minutes" className="block text-xs text-[var(--text-secondary)]">
                Minutes
              </label>
              <input
                type="number"
                id="minutes"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, parseInt(e.target.value) || 0))}
                className="input"
              />
            </div>
          </div>
        </div>

        <div className="transition-all duration-200">
          <label htmlFor="confidence" className="block text-sm font-medium text-[var(--text-secondary)]">
            Confidence Level: <span className="font-semibold">{confidence}/10 ({getConfidenceText()})</span>
          </label>
          <div className="mt-2 relative">
            <div className="w-full h-2 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getConfidenceColor()} transition-all duration-300 ease-in-out`}
                style={{ width: `${(confidence / 10) * 100}%` }}
              ></div>
            </div>
            <input
              type="range"
              id="confidence"
              min="1"
              max="10"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="absolute top-0 w-full h-2 opacity-0 cursor-pointer"
            />
            <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary mr-2 transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary transform hover:scale-[1.01] active:scale-[0.99]"
          >
            Save Log
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualLogForm;