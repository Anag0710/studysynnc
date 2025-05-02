import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import StudyTimer from '../components/study/StudyTimer';
import ManualLogForm from '../components/study/ManualLogForm';
import CalendarLog from '../components/study/CalendarLog';
import Leaderboard from '../components/study/Leaderboard';
import ReminderModal from '../components/study/ReminderModal';
import GroupActions from '../components/study/GroupActions';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { Log } from '../models/Log';
import studyService from '../services/StudyService';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const { group, hasGroup } = useGroup();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [allGroupLogs, setAllGroupLogs] = useState<Log[]>([]);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [logFormOpen, setLogFormOpen] = useState(false);
  const [manualLogFormOpen, setManualLogFormOpen] = useState(false);
  const [topics, setTopics] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(5);
  const [showReminder, setShowReminder] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [quickStats, setQuickStats] = useState({
    today: { totalMinutes: 0, count: 0 },
    week: { totalMinutes: 0, count: 0 },
    month: { totalMinutes: 0, count: 0 },
    streak: 0
  });
  const [userRank, setUserRank] = useState(0);
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState({
    timer: true,
    calendar: true,
    group: true,
    leaderboard: hasGroup,
    stats: true
  });

  // Animation triggers
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // Load user's logs from StudyService
      const userLogs = studyService.getUserLogs(user.id);
      setLogs(userLogs);
      
      // Update quick stats
      const stats = studyService.getQuickStats(user.id);
      setQuickStats(stats);
      
      // If user is in a group, get all logs for the group
      if (user.groupId) {
        const rank = studyService.getUserRank(user.id, user.groupId);
        setUserRank(rank);
        
        // Get all logs from all group members
        const groupLogs = studyService.getAllLogs().filter(log => log.groupId === user.groupId);
        setAllGroupLogs(groupLogs);
        
        // Setup group member data
        const uniqueUserIds = Array.from(new Set(groupLogs.map(log => log.userId)));
        const colors = ['bg-blue-500', 'bg-red-500', 'bg-yellow-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500']; 
        
        const members = uniqueUserIds.map((id, index) => {
          return {
            id,
            username: id === user.id ? 'You' : `Group Member ${index + 1}`,
            color: id === user.id ? 'bg-blue-500' : colors[(index + 1) % colors.length]
          };
        });
        
        setGroupMembers(members);
      }
      
      // Add animation triggers after a short delay
      setTimeout(() => {
        setAnimateStats(true);
      }, 300);
      
      // Check if the user hasn't logged study time today and show the reminder
      const today = new Date().toISOString().split('T')[0];
      const hasLoggedToday = userLogs.some(log => log.date === today);
      
      if (!hasLoggedToday && user.groupId) {
        setTimeout(() => {
          setShowReminder(true);
        }, 5000); // Show reminder after 5 seconds
      }
    }
  }, [user]);

  const handleTimerFinish = (minutes: number) => {
    setTimerMinutes(minutes);
    setLogFormOpen(true);
  };

  const handleLogSubmit = () => {
    if (!user) return;
    
    try {
      // Parse topics into array
      const topicsArray = topics.split(',').map((t: string) => t.trim()).filter((t: string) => t);
      
      // Create new log
      const newLog: Log = {
        id: `log-${Date.now()}`,
        userId: user.id,
        groupId: user.groupId || '',
        date: new Date().toISOString().split('T')[0],
        topics: topicsArray,
        timeStudied: timerMinutes,
        confidence: confidence
      };
      
      // Add to study service
      studyService.addLog(newLog);
      
      // Update local state
      setLogs([...logs, newLog]);
      if (user.groupId) {
        setAllGroupLogs([...allGroupLogs, newLog]);
      }
      
      // Clear form
      setTopics('');
      setConfidence(5);
      setLogFormOpen(false);
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-slideInUp';
      toast.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Study session logged successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
      
      // Update stats
      const updatedStats = studyService.getQuickStats(user.id);
      setQuickStats(updatedStats);
      
      if (user.groupId) {
        const updatedRank = studyService.getUserRank(user.id, user.groupId);
        setUserRank(updatedRank);
      }
    } catch (error) {
      console.error('Failed to save study session', error);
      
      // Show error toast
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-slideInUp';
      toast.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Failed to log study session. Please try again.</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Remove toast after 3 seconds
      setTimeout(() => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
    }
  };

  const handleManualLogSubmit = (manualLog: Partial<Log>) => {
    if (!user) return;
    
    try {
      // Create new log
      const newLog: Log = {
        id: `log-${Date.now()}`,
        userId: user.id,
        groupId: user.groupId || '',
        date: new Date().toISOString().split('T')[0],
        ...manualLog,
        topics: Array.isArray(manualLog.topics) ? manualLog.topics : manualLog.topics?.split(',').map((t: string) => t.trim()).filter((t: string) => t) || [],
        timeStudied: manualLog.timeStudied || 0,
        confidence: manualLog.confidence || 5
      };
      
      // Add to study service
      studyService.addLog(newLog);
      
      // Update local state
      setLogs([...logs, newLog]);
      if (user.groupId) {
        setAllGroupLogs([...allGroupLogs, newLog]);
      }
      
      // Clear form
      setManualLogFormOpen(false);
      
      // Show success notification
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 animate-slideInUp';
      toast.innerHTML = `
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Study session logged successfully!</span>
        </div>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.classList.add('animate-fadeOut');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 3000);
      
      // Update stats
      const updatedStats = studyService.getQuickStats(user.id);
      setQuickStats(updatedStats);
      
      if (user.groupId) {
        const updatedRank = studyService.getUserRank(user.id, user.groupId);
        setUserRank(updatedRank);
      }
    } catch (error) {
      console.error('Failed to save manual log', error);
    }
  };

  const handleReminderClose = () => {
    setShowReminder(false);
  };

  const handleLogNow = () => {
    setShowReminder(false);
    setManualLogFormOpen(true);
  };
  
  const handleSelectDate = (date: string) => {
    if (!user) return;
    
    // Show logs for the selected date
    const logsForDate = studyService.getLogsByDate(user.id, date);
    console.log(`Logs for ${date}:`, logsForDate);
    
    // Here you could open a modal to show logs for the selected date
    // or update some part of the UI to display the logs
  };

  const handleToggleCalendarView = () => {
    setShowAllMembers(!showAllMembers);
  };

  // Toggle card visibility
  const toggleCardVisibility = (card: keyof typeof isCardVisible) => {
    setIsCardVisible(prev => ({
      ...prev,
      [card]: !prev[card]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-main)]">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-[var(--bg-card)] shadow-lg flex items-center justify-center">
                <div className="text-indigo-500 text-xl font-bold">S</div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-[var(--text-secondary)] animate-pulse">Loading your study dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-[var(--bg-card)] rounded-lg shadow-lg p-8 text-center max-w-md mx-auto transform transition-all animate-slide-up">
            <svg className="w-16 h-16 text-indigo-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-[var(--text-secondary)] mb-6">Please login to access the dashboard and track your study progress.</p>
            <button 
              onClick={() => router.push('/login')}
              className="btn-primary py-3 px-6 rounded-lg w-full flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login Now
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard | StudySync</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 animate-slide-in-bottom">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              <span className="text-gradient">Study Dashboard</span>
            </h1>
            <p className="text-[var(--text-secondary)]">
              Track your progress, stay consistent, and grow with your study group.
            </p>
          </div>
          <div className="flex mt-4 md:mt-0 space-x-2">
            <button 
              onClick={() => setManualLogFormOpen(true)}
              className="btn-primary rounded-md flex items-center shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Log Study Session
            </button>
          </div>
        </div>
        
        {/* Main dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Study Timer Card */}
            <div className={`transition-all duration-500 transform ${isCardVisible.timer ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
              <div className="bg-[var(--bg-card)] rounded-xl shadow-lg overflow-hidden border border-[var(--border-color)] card-accent-top">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-md mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Study Time</h2>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleCardVisibility('timer')}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  {!manualLogFormOpen && (
                    <StudyTimer onFinish={handleTimerFinish} />
                  )}

                  {manualLogFormOpen && (
                    <ManualLogForm 
                      onSubmit={handleManualLogSubmit}
                      onCancel={() => setManualLogFormOpen(false)}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Log Form Card - shows after timer finishes */}
            {logFormOpen && (
              <div className="bg-[var(--bg-card)] p-6 rounded-xl shadow-lg animate-slide-in-bottom border border-[var(--border-color)]">
                <h2 className="text-xl font-bold mb-4">Log Study Session</h2>
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="topics"
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      id="topics"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      className="mt-1 block w-full border border-[var(--border-color)] rounded-md shadow-sm p-2 focus-ring"
                      placeholder="React, TypeScript, CSS"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="confidence"
                      className="block text-sm font-medium text-[var(--text-secondary)]"
                    >
                      Confidence Level (1-10): {confidence}
                    </label>
                    <input
                      type="range"
                      id="confidence"
                      min="1"
                      max="10"
                      value={confidence}
                      onChange={(e) => setConfidence(parseInt(e.target.value))}
                      className="mt-1 block w-full"
                    />
                    <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setLogFormOpen(false)}
                      className="btn-secondary rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogSubmit}
                      className="btn-primary rounded-md"
                    >
                      Save Log
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Calendar View */}
            <div className={`transition-all duration-500 transform ${isCardVisible.calendar ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
              <div className="bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] card-accent-top">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-md mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Your Study Calendar</h2>
                    </div>
                    <div className="flex items-center space-x-2">
                      {hasGroup && groupMembers.length > 1 && (
                        <button 
                          onClick={handleToggleCalendarView}
                          className="px-3 py-1 text-sm bg-indigo-100 dark:bg-indigo-900 dark:bg-opacity-30 text-indigo-700 dark:text-indigo-300 rounded-full transition-all hover:bg-indigo-200 dark:hover:bg-indigo-800 shadow-sm"
                        >
                          {showAllMembers ? 'Show Only My Time' : 'Show Group Time'}
                        </button>
                      )}
                      <button
                        onClick={() => toggleCardVisibility('calendar')}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <CalendarLog 
                    logs={showAllMembers && hasGroup ? allGroupLogs : logs} 
                    onSelectDate={handleSelectDate}
                    groupMembers={groupMembers}
                    currentUserId={user.id}
                    showAllMembers={showAllMembers}
                  />
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <div className={`transition-all duration-500 transform ${isCardVisible.stats ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
              <div className="bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] card-accent-top">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-green-500 to-emerald-400 flex items-center justify-center shadow-md mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Quick Stats</h2>
                    </div>
                    <button
                      onClick={() => toggleCardVisibility('stats')}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:from-opacity-20 dark:to-blue-800 dark:to-opacity-10 rounded-lg p-4 text-center shadow-sm transition-all duration-700 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '100ms'}}>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Today</p>
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                        {studyService.formatStudyTime(quickStats.today.totalMinutes)}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:from-opacity-20 dark:to-green-800 dark:to-opacity-10 rounded-lg p-4 text-center shadow-sm transition-all duration-700 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '200ms'}}>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">This Week</p>
                      <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                        {studyService.formatStudyTime(quickStats.week.totalMinutes)}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900 dark:from-opacity-20 dark:to-purple-800 dark:to-opacity-10 rounded-lg p-4 text-center shadow-sm transition-all duration-700 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '300ms'}}>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Streak</p>
                      <div className="flex items-center justify-center">
                        <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                          {quickStats.streak}
                        </p>
                        {quickStats.streak >= 3 && (
                          <span className="ml-1 text-orange-500 dark:text-orange-400 text-xl animate-pulse-slow">🔥</span>
                        )}
                      </div>
                    </div>
                    <div className={`bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900 dark:from-opacity-20 dark:to-amber-800 dark:to-opacity-10 rounded-lg p-4 text-center shadow-sm transition-all duration-700 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '400ms'}}>
                      <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">Rank</p>
                      <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                        {userRank > 0 ? (
                          <span className="flex items-center justify-center">
                            #{userRank}
                            {userRank === 1 && <span className="ml-1">👑</span>}
                          </span>
                        ) : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Monthly progress */}
                  <div className={`mt-5 transition-all duration-700 transform ${animateStats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`} style={{transitionDelay: '500ms'}}>
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="text-sm font-medium text-[var(--text-secondary)]">Monthly Progress</h3>
                      <span className="text-xs text-[var(--text-secondary)]">
                        {studyService.formatStudyTime(quickStats.month.totalMinutes)}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${Math.min(100, (quickStats.month.totalMinutes / 3000) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-[var(--text-secondary)] mt-1">
                      <span>Goal: 50hrs</span>
                      <span>{Math.round((quickStats.month.totalMinutes / 3000) * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Group Card */}
            <div className={`transition-all duration-500 transform ${isCardVisible.group ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
              <div className="bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] card-accent-top">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-md bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-md mr-3">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h2 className="text-xl font-bold">Your Study Group</h2>
                    </div>
                    <button
                      onClick={() => toggleCardVisibility('group')}
                      className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <GroupActions />
                </div>
              </div>
            </div>

            {/* Leaderboard Card */}
            {hasGroup && (
              <div className={`transition-all duration-500 transform ${isCardVisible.leaderboard ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 h-0 overflow-hidden'}`}>
                <div className="bg-[var(--bg-card)] rounded-xl shadow-lg border border-[var(--border-color)] card-accent-top">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shadow-md mr-3">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold">Leaderboard</h2>
                      </div>
                      <button
                        onClick={() => toggleCardVisibility('leaderboard')}
                        className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <Leaderboard />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showReminder && (
          <ReminderModal onClose={handleReminderClose} onLogNow={handleLogNow} />
        )}
      </div>
    </Layout>
  );
}