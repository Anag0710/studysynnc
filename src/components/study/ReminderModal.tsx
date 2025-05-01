import { useState, useEffect } from 'react';

interface ReminderModalProps {
  onClose: () => void;
  onLogNow: () => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ onClose, onLogNow }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show the modal with a slight delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div 
            className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full transform transition-all duration-300 ease-in-out"
            style={{ 
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.9)' 
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Daily Study Reminder</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-2">
              <p className="text-gray-600">
                Have you studied today? Don't forget to log your progress to maintain your streak and stay accountable with your group.
              </p>
            </div>
            
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Remind Me Later
              </button>
              <button
                onClick={onLogNow}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Log My Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ReminderModal;