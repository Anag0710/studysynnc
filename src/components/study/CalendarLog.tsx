import { useState } from 'react';
import { Log } from '../../models/Log';

interface CalendarLogProps {
  logs: Log[];
  onSelectDate: (date: string) => void;
}

const CalendarLog: React.FC<CalendarLogProps> = ({ logs, onSelectDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const getMonthData = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const calendarDays = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      calendarDays.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push(new Date(year, month, day));
    }
    
    return calendarDays;
  };
  
  const getLogForDate = (date: Date) => {
    if (!logs) return null;
    const dateString = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
    return logs.find(log => log.date === dateString);
  };
  
  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const calendarDays = getMonthData();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={previousMonth}
          className="text-gray-600 hover:text-gray-900"
        >
          &lt; Prev
        </button>
        <h2 className="text-xl font-bold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button 
          onClick={nextMonth}
          className="text-gray-600 hover:text-gray-900"
        >
          Next &gt;
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {dayNames.map(day => (
          <div key={day} className="text-center font-medium py-1">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="h-12 p-1 bg-gray-100" />;
          }
          
          const log = getLogForDate(day);
          const hasStudied = !!log;
          
          return (
            <div
              key={day.getDate()}
              onClick={() => onSelectDate(day.toISOString().split('T')[0])}
              className={`h-12 p-1 border cursor-pointer ${
                hasStudied
                  ? 'bg-green-100 border-green-300 hover:bg-green-200'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="flex flex-col h-full">
                <span className="text-xs">{day.getDate()}</span>
                {hasStudied && (
                  <div className="text-xs mt-auto text-green-700">
                    {log.timeStudied} min
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarLog;