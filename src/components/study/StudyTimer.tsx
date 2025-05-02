import { useState, useEffect, useCallback } from 'react';

interface StudyTimerProps {
  onFinish: (minutes: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onFinish }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'custom'>('pomodoro');
  const [customMinutes, setCustomMinutes] = useState(25);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [animation, setAnimation] = useState(false);
  
  // Pomodoro presets
  const pomodoroPresets = [
    { name: "Focus", minutes: 25, color: "from-indigo-500 to-purple-500" },
    { name: "Short Break", minutes: 5, color: "from-green-500 to-emerald-400" },
    { name: "Long Break", minutes: 15, color: "from-blue-500 to-cyan-400" }
  ];
  const [activePreset, setActivePreset] = useState(0);
  
  // Handle timer completion
  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    if (soundEnabled) {
      try {
        const audio = new Audio('/sounds/timer-complete.mp3');
        audio.play();
      } catch (error) {
        console.error('Failed to play sound', error);
      }
    }
    
    // Convert seconds to minutes for the log
    const minutesStudied = Math.round(seconds / 60);
    onFinish(minutesStudied);
    
    // Reset timer
    setSeconds(0);
  }, [seconds, onFinish, soundEnabled]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => {
          if (prevSeconds <= 1) {
            clearInterval(interval!);
            handleTimerComplete();
            return 0;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, handleTimerComplete]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    // If timer wasn't previously set up, use preset or custom minutes
    if (seconds === 0) {
      const minutesToUse = timerMode === 'pomodoro' 
        ? pomodoroPresets[activePreset].minutes 
        : customMinutes;
      setSeconds(minutesToUse * 60);
    }
    
    setIsRunning(true);
    setAnimation(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setAnimation(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
    setAnimation(false);
  };

  const handleSelectPreset = (index: number) => {
    setActivePreset(index);
    setSeconds(pomodoroPresets[index].minutes * 60);
    setAnimation(false);
  };

  const handleCustomMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0 && value <= 120) {
      setCustomMinutes(value);
      setSeconds(value * 60);
    }
  };

  // Calculate progress percentage
  const calculateProgress = (): number => {
    if (seconds === 0) return 0;
    
    const totalSeconds = timerMode === 'pomodoro' 
      ? pomodoroPresets[activePreset].minutes * 60 
      : customMinutes * 60;
      
    return 100 - ((seconds / totalSeconds) * 100);
  };

  return (
    <div className="study-timer-container">
      {/* Timer Mode Selector */}
      <div className="flex justify-center mb-4">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button 
            type="button" 
            className={`px-4 py-2 text-sm font-medium rounded-l-lg border ${timerMode === 'pomodoro' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:bg-opacity-30 dark:text-indigo-300 dark:border-indigo-700' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
            onClick={() => setTimerMode('pomodoro')}
          >
            Pomodoro
          </button>
          <button 
            type="button" 
            className={`px-4 py-2 text-sm font-medium rounded-r-lg border ${timerMode === 'custom' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 dark:bg-indigo-900 dark:bg-opacity-30 dark:text-indigo-300 dark:border-indigo-700' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700'}`}
            onClick={() => setTimerMode('custom')}
          >
            Custom
          </button>
        </div>
      </div>
      
      {/* Pomodoro Presets */}
      {timerMode === 'pomodoro' && (
        <div className="grid grid-cols-3 gap-2 mb-6">
          {pomodoroPresets.map((preset, index) => (
            <button
              key={preset.name}
              onClick={() => handleSelectPreset(index)}
              className={`text-center p-2 rounded-lg transition-all duration-200 ${
                index === activePreset 
                  ? `bg-gradient-to-r ${preset.color} text-white shadow-md transform scale-105` 
                  : 'bg-[var(--bg-main)] text-[var(--text-secondary)] hover:bg-[var(--hover-color)]'
              }`}
            >
              <div className="font-medium">{preset.name}</div>
              <div className={index === activePreset ? 'text-white' : 'text-[var(--text-secondary)]'}>
                {preset.minutes} min
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Custom Timer Input */}
      {timerMode === 'custom' && (
        <div className="mb-6">
          <label htmlFor="customMinutes" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            Study Duration (minutes)
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="customMinutes"
              min="1"
              max="120"
              value={customMinutes}
              onChange={handleCustomMinutesChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="ml-3 w-12 text-[var(--text-primary)]">{customMinutes}</span>
          </div>
          <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
            <span>1 min</span>
            <span>120 min</span>
          </div>
        </div>
      )}
      
      {/* Timer Display */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Circle Progress */}
          <svg className="w-full h-full -rotate-90 transform">
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="8"
            />
            <circle
              cx="80"
              cy="80"
              r="70"
              fill="none"
              stroke="url(#timerGradient)"
              strokeWidth="8"
              strokeDasharray="439.8"
              strokeDashoffset={439.8 - (calculateProgress() / 100 * 439.8)}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
            <defs>
              <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Time display */}
          <div className={`absolute flex flex-col items-center transition-all duration-300 ${animation ? 'animate-pulse-slow' : ''}`}>
            <div className="text-4xl font-bold">
              {formatTime(seconds)}
            </div>
            {isRunning && (
              <div className="text-xs text-[var(--text-secondary)] mt-1">
                {timerMode === 'pomodoro' ? pomodoroPresets[activePreset].name : 'Studying'}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Timer Controls */}
      <div className="flex justify-center space-x-4 mb-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-2 rounded-full flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Start</span>
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-2 rounded-full flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Pause</span>
          </button>
        )}
        
        <button
          onClick={handleReset}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-full flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset</span>
        </button>
      </div>
      
      {/* Additional options */}
      <div className="flex justify-center items-center mt-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
            checked={soundEnabled}
            onChange={() => setSoundEnabled(!soundEnabled)}
          />
          <span className="ml-2 text-sm text-[var(--text-secondary)]">Sound notification</span>
        </label>
      </div>
    </div>
  );
};

export default StudyTimer;