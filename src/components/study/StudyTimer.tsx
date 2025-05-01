import { useState, useEffect } from 'react';

interface StudyTimerProps {
  onFinish: (minutes: number) => void;
}

const StudyTimer: React.FC<StudyTimerProps> = ({ onFinish }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleStart = () => {
    setIsRunning(true);
  };
  
  const handleStop = () => {
    setIsRunning(false);
    const minutes = Math.floor(seconds / 60);
    onFinish(minutes);
  };
  
  const handleReset = () => {
    setIsRunning(false);
    setSeconds(0);
  };
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-4">Study Timer</h2>
      <div className="text-4xl text-center font-mono mb-6">
        {formatTime()}
      </div>
      <div className="flex justify-center space-x-4">
        {!isRunning ? (
          <button 
            onClick={handleStart} 
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Start
          </button>
        ) : (
          <button 
            onClick={handleStop} 
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Stop
          </button>
        )}
        <button 
          onClick={handleReset} 
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default StudyTimer;