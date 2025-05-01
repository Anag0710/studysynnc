import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import StudyTimer from '../components/study/StudyTimer';
import CalendarLog from '../components/study/CalendarLog';
import Leaderboard from '../components/study/Leaderboard';
import ReminderModal from '../components/study/ReminderModal';
import { useAuth } from '../contexts/AuthContext';
import { Log } from '../models/Log';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [logFormOpen, setLogFormOpen] = useState(false);
  const [topics, setTopics] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(5);
  const [showReminder, setShowReminder] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(0);
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // In a real app, fetch logs from API
    if (user) {
      // Fetch user's logs
      // fetchLogs();
      
      // Fetch group members
      // fetchGroupMembers();
      
      // For now, we'll use dummy data
      setLogs([
        {
          id: '1',
          userId: user.id,
          groupId: user.groupId || '',
          date: '2025-04-30',
          topics: ['React', 'NextJS'],
          timeStudied: 120,
          confidence: 7
        }
      ]);
      
      setGroupMembers([
        {
          id: user.id,
          username: user.username,
          totalTime: 120,
          streak: 3,
          topicsCount: 2,
          passwordHash: ''
        },
        {
          id: '2',
          username: 'studybuddy',
          totalTime: 90,
          streak: 5,
          topicsCount: 3,
          passwordHash: ''
        }
      ]);
      
      // Check if user has logged study time today
      const today = new Date().toISOString().split('T')[0];
      const hasLoggedToday = logs.some(log => log.date === today);
      
      // Show reminder if user hasn't logged today and it's evening time
      const currentHour = new Date().getHours();
      if (!hasLoggedToday && currentHour >= 19) {
        // Wait a few seconds before showing the reminder
        const timer = setTimeout(() => {
          setShowReminder(true);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, logs]);
  
  const handleTimerFinish = async (minutes: number) => {
    if (minutes < 1) {
      alert('Study session too short to record.');
      return;
    }

    setTimerMinutes(minutes);
    setLogFormOpen(true);
  };

  const handleLogSubmit = () => {
    try {
      // Here you would save the study session to your database
      const topicsList = topics.split(',').map(t => t.trim()).filter(t => t !== '');
      
      // For now, just add it to the current logs
      const today = new Date().toISOString().split('T')[0];
      const newLog: Log = {
        id: Date.now().toString(),
        userId: user?.id || '',
        groupId: user?.groupId || '',
        date: today,
        topics: topicsList.length > 0 ? topicsList : ['Study Session'],
        timeStudied: timerMinutes,
        confidence: confidence
      };
      
      setLogs([...logs, newLog]);
      setLogFormOpen(false);
      setTopics('');
      setConfidence(5);
      setTimerMinutes(0);
    } catch (error) {
      console.error('Failed to save study session', error);
    }
  };
  
  const handleReminderClose = () => {
    setShowReminder(false);
  };
  
  const handleLogNow = () => {
    setShowReminder(false);
    setLogFormOpen(true);
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return null;
  }
  
  return (
    <Layout>
      <Head>
        <title>Dashboard | StudySync</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Study Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <StudyTimer onFinish={handleTimerFinish} />
            
            {logFormOpen && (
              <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold mb-4">Log Study Session</h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="topics" className="block text-sm font-medium text-gray-700">
                      Topics (comma separated)
                    </label>
                    <input
                      type="text"
                      id="topics"
                      value={topics}
                      onChange={(e) => setTopics(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="React, TypeScript, CSS"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="confidence" className="block text-sm font-medium text-gray-700">
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
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      onClick={() => setLogFormOpen(false)}
                      className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleLogSubmit}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                    >
                      Save Log
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Your Study Calendar</h2>
              <CalendarLog logs={logs} onSelectDate={(date) => console.log(date)} />
            </div>
          </div>
          
          <div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Group Leaderboard</h2>
              <Leaderboard users={groupMembers} />
            </div>
          </div>
        </div>
        
        {showReminder && (
          <ReminderModal 
            onClose={handleReminderClose} 
            onLogNow={handleLogNow} 
          />
        )}
      </div>
    </Layout>
  );
}