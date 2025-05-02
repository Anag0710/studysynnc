import React, { useState, useEffect } from 'react';
import { Log } from '../../models/Log';

interface CalendarLogProps {
  logs: Log[];
  onSelectDate: (date: string) => void;
  groupMembers?: any[];
  currentUserId?: string;
  showAllMembers?: boolean;
}

const CalendarLog: React.FC<CalendarLogProps> = ({ logs, onSelectDate, groupMembers = [], currentUserId = '', showAllMembers = false }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date; studyMinutes: number }>>([]);
  const [monthOffset, setMonthOffset] = useState(0);
  const [animation, setAnimation] = useState<'slide-left' | 'slide-right' | ''>('');

  // Get month name
  const getMonthName = (date: Date) => {
    return date.toLocaleString('default', { month: 'long' });
  };
  
  // Get year
  const getYear = (date: Date) => {
    return date.getFullYear();
  };

  // Generate calendar days for current month view
  useEffect(() => {
    const generateCalendarDays = () => {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + monthOffset;
      
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      
      const daysInMonth = lastDay.getDate();
      const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 1 is Monday, etc.
      
      const days: Array<{ date: Date; studyMinutes: number }> = [];
      
      // Add previous month days to fill the first week
      const prevMonthLastDay = new Date(year, month, 0).getDate();
      for (let i = 0; i < startDayOfWeek; i++) {
        const date = new Date(year, month - 1, prevMonthLastDay - startDayOfWeek + i + 1);
        days.push({
          date,
          studyMinutes: getStudyMinutesForDate(date),
        });
      }
      
      // Add days of current month
      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        days.push({
          date,
          studyMinutes: getStudyMinutesForDate(date),
        });
      }
      
      // Add next month days to complete the last week
      const remainingDays = 7 - (days.length % 7);
      if (remainingDays < 7) {
        for (let i = 1; i <= remainingDays; i++) {
          const date = new Date(year, month + 1, i);
          days.push({
            date,
            studyMinutes: getStudyMinutesForDate(date),
          });
        }
      }
      
      return days;
    };
    
    const newCalendarDate = new Date();
    newCalendarDate.setMonth(newCalendarDate.getMonth() + monthOffset);
    setCurrentDate(newCalendarDate);
    
    setCalendarDays(generateCalendarDays());
  }, [logs, monthOffset]);

  // Calculate study minutes for a specific date
  const getStudyMinutesForDate = (date: Date): number => {
    const dateString = date.toDateString();
    return logs
      .filter(log => new Date(log.date).toDateString() === dateString)
      .reduce((total, log) => total + log.timeStudied, 0);
  };

  // Navigate to previous month
  const goToPrevMonth = () => {
    setAnimation('slide-right');
    setTimeout(() => {
      setMonthOffset(prev => prev - 1);
      setTimeout(() => setAnimation(''), 300);
    }, 200);
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setAnimation('slide-left');
    setTimeout(() => {
      setMonthOffset(prev => prev + 1);
      setTimeout(() => setAnimation(''), 300);
    }, 200);
  };

  // Reset to current month
  const goToCurrentMonth = () => {
    setAnimation(monthOffset > 0 ? 'slide-right' : 'slide-left');
    setTimeout(() => {
      setMonthOffset(0);
      setTimeout(() => setAnimation(''), 300);
    }, 200);
  };

  // Get CSS class for study minutes
  const getStudyIntensityClass = (minutes: number): string => {
    if (minutes === 0) return '';
    if (minutes < 30) return 'bg-[var(--calendar-study-low)]';
    if (minutes < 60) return 'bg-[var(--calendar-study-med)]';
    if (minutes < 120) return 'bg-[var(--calendar-study-high)]';
    return 'bg-[var(--calendar-study-max)]';
  };

  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if a date is in the current month
  const isCurrentMonth = (date: Date): boolean => {
    return date.getMonth() === (new Date().getMonth() + monthOffset);
  };

  // Format date for hover tooltip
  const formatDateForDisplay = (date: Date): string => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="calendar-container rounded-xl border border-[var(--border-color)] p-4 bg-[var(--bg-card)] shadow-sm animate-slide-in-bottom">
      {/* Calendar header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="text-lg font-semibold text-[var(--text-primary)]">
            {getMonthName(currentDate)} {getYear(currentDate)}
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={goToPrevMonth}
              className="p-2 rounded-full hover:bg-[var(--hover-color)] transition-colors"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={goToCurrentMonth}
              className="p-2 px-3 rounded-lg text-sm hover:bg-[var(--hover-color)] transition-colors"
              aria-label="Current month"
            >
              Today
            </button>
            <button 
              onClick={goToNextMonth}
              className="p-2 rounded-full hover:bg-[var(--hover-color)] transition-colors"
              aria-label="Next month"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <div 
              key={index} 
              className="flex justify-center items-center h-8 text-xs font-medium text-[var(--text-secondary)]"
            >
              {day}
            </div>
          ))}
        </div>
      </div>
      
      {/* Calendar grid */}
      <div 
        className={`grid grid-cols-7 gap-1 ${
          animation === 'slide-left' ? 'animate-slide-in-left' : 
          animation === 'slide-right' ? 'animate-slide-in-right' : ''
        }`}
      >
        {calendarDays.map((day, index) => {
          const isCurrentDay = isToday(day.date);
          const inCurrentMonth = isCurrentMonth(day.date);
          
          return (
            <div 
              key={index}
              onClick={() => onSelectDate(day.date.toDateString())}
              className={`
                relative flex flex-col justify-center items-center 
                p-1 h-10 rounded-lg cursor-pointer transition-all
                ${inCurrentMonth ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] opacity-40'}
                ${getStudyIntensityClass(day.studyMinutes)}
                ${isCurrentDay ? 'ring-2 ring-[var(--calendar-today-ring)]' : ''}
                hover:bg-[var(--calendar-day-hover)]
              `}
              title={`${formatDateForDisplay(day.date)}${day.studyMinutes > 0 ? ` - ${day.studyMinutes} minutes studied` : ''}`}
            >
              <span className={`text-sm ${isCurrentDay ? 'font-bold' : ''}`}>
                {day.date.getDate()}
              </span>
              
              {/* Dot indicator for days with study time */}
              {day.studyMinutes > 0 && inCurrentMonth && !isCurrentDay && (
                <div className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-70"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex justify-end items-center text-xs text-[var(--text-secondary)]">
        <div className="flex items-center space-x-1 mr-3">
          <div className="w-3 h-3 rounded-sm bg-[var(--calendar-study-low)]"></div>
          <span>&lt;30m</span>
        </div>
        <div className="flex items-center space-x-1 mr-3">
          <div className="w-3 h-3 rounded-sm bg-[var(--calendar-study-med)]"></div>
          <span>&lt;1h</span>
        </div>
        <div className="flex items-center space-x-1 mr-3">
          <div className="w-3 h-3 rounded-sm bg-[var(--calendar-study-high)]"></div>
          <span>&lt;2h</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 rounded-sm bg-[var(--calendar-study-max)]"></div>
          <span>≥2h</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarLog;