import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import CalendarLog from '../components/study/CalendarLog';
import { useAuth } from '../contexts/AuthContext';
import { useGroup } from '../contexts/GroupContext';
import { Log } from '../models/Log';
import studyService from '../services/StudyService';

export default function Calendar() {
  const { user, loading } = useAuth();
  const { group, hasGroup } = useGroup();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [allGroupLogs, setAllGroupLogs] = useState<Log[]>([]);
  const [groupMembers, setGroupMembers] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<Log[]>([]);
  const [showAllMembers, setShowAllMembers] = useState(false);
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // Load real logs from StudyService
    if (user) {
      // Get user's logs
      const userLogs = studyService.getUserLogs(user.id);
      setLogs(userLogs);
      
      // If user is in a group, get all group logs
      if (user.groupId) {
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

      // If there aren't any logs in the service yet, generate some demo data
      if (userLogs.length === 0) {
        const dummyLogs = [
          {
            id: '1',
            userId: user.id,
            groupId: user.groupId || '',
            date: '2025-04-30',
            topics: ['React', 'NextJS'],
            timeStudied: 120,
            confidence: 7
          },
          {
            id: '2',
            userId: user.id,
            groupId: user.groupId || '',
            date: '2025-04-29',
            topics: ['TypeScript'],
            timeStudied: 90,
            confidence: 6
          },
          {
            id: '3',
            userId: user.id,
            groupId: user.groupId || '',
            date: '2025-04-27',
            topics: ['CSS', 'Tailwind'],
            timeStudied: 60,
            confidence: 8
          }
        ];
        
        setLogs(dummyLogs);
        
        // Add some demo data for group members
        if (user.groupId && !allGroupLogs.length) {
          // Generate data for fictional group members
          const groupMemberLogs = [
            {
              id: '4',
              userId: 'member1',
              groupId: user.groupId,
              date: '2025-04-30',
              topics: ['Python', 'Data Science'],
              timeStudied: 75,
              confidence: 7
            },
            {
              id: '5',
              userId: 'member1',
              groupId: user.groupId,
              date: '2025-04-28',
              topics: ['Machine Learning'],
              timeStudied: 120,
              confidence: 5
            },
            {
              id: '6',
              userId: 'member2',
              groupId: user.groupId,
              date: '2025-04-29',
              topics: ['JavaScript', 'Vue'],
              timeStudied: 60,
              confidence: 8
            }
          ];
          
          setAllGroupLogs([...dummyLogs, ...groupMemberLogs]);
        }
      }
    }
  }, [user, hasGroup]);
  
  useEffect(() => {
    if (selectedDate) {
      if (showAllMembers && hasGroup) {
        // Show all logs for the selected date from all group members
        const logsForDate = allGroupLogs.filter(log => log.date === selectedDate);
        setSelectedLogs(logsForDate);
      } else {
        // Show only the current user's logs for the selected date
        const logsForDate = logs.filter(log => log.date === selectedDate);
        setSelectedLogs(logsForDate);
      }
    } else {
      setSelectedLogs([]);
    }
  }, [selectedDate, logs, allGroupLogs, showAllMembers, hasGroup]);
  
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleToggleView = () => {
    setShowAllMembers(!showAllMembers);
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
        <title>Study Calendar | StudySync</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Study Calendar</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Calendar View</h2>
              {hasGroup && groupMembers.length > 1 && (
                <button 
                  onClick={handleToggleView}
                  className="text-sm px-3 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                >
                  {showAllMembers ? 'Show Only My Time' : 'Show Group Time'}
                </button>
              )}
            </div>
            <CalendarLog 
              logs={showAllMembers && hasGroup ? allGroupLogs : logs} 
              onSelectDate={handleSelectDate}
              groupMembers={groupMembers}
              currentUserId={user.id}
              showAllMembers={showAllMembers}
            />
          </div>
          
          <div>
            {selectedLogs.length > 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">{formatDate(selectedDate || '')}</h2>
                
                {selectedLogs.map((log, index) => {
                  const isCurrentUser = log.userId === user.id;
                  const memberInfo = groupMembers.find(m => m.id === log.userId);
                  
                  return (
                    <div key={log.id} className={`p-4 rounded-lg mb-4 ${isCurrentUser ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      {showAllMembers && hasGroup && (
                        <div className="flex items-center mb-2">
                          <div className={`w-2 h-2 mr-2 rounded-full ${memberInfo?.color || 'bg-gray-500'}`}></div>
                          <span className="font-medium">{isCurrentUser ? 'You' : memberInfo?.username || 'Group Member'}</span>
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <div>
                          <h3 className="text-md font-semibold">Time Studied</h3>
                          <p className="text-gray-700">
                            {studyService.formatStudyTime(log.timeStudied)}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-md font-semibold">Topics Covered</h3>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {log.topics.map((topic, i) => (
                              <span 
                                key={i} 
                                className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-md font-semibold">Confidence Level</h3>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div 
                              className="bg-indigo-600 h-2.5 rounded-full" 
                              style={{ width: `${(log.confidence / 10) * 100}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>Low</span>
                            <span>Medium</span>
                            <span>High</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-center">
                  Select a day from the calendar to view study details
                </p>
              </div>
            )}
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Monthly Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Study Time:</span>
                  <span className="font-semibold">
                    {studyService.formatStudyTime(logs.reduce((total, log) => total + log.timeStudied, 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Study Days:</span>
                  <span className="font-semibold">{new Set(logs.map(log => log.date)).size} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Average Daily Time:</span>
                  <span className="font-semibold">
                    {logs.length > 0 
                      ? studyService.formatStudyTime(Math.round(logs.reduce((total, log) => total + log.timeStudied, 0) / 
                          new Set(logs.map(log => log.date)).size))
                      : '0 min'}
                  </span>
                </div>
                
                {hasGroup && showAllMembers && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <h3 className="font-semibold mb-2">Group Study Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Group Total Time:</span>
                        <span className="font-semibold">
                          {studyService.formatStudyTime(allGroupLogs.reduce((total, log) => total + log.timeStudied, 0))}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Group Study Days:</span>
                        <span className="font-semibold">{new Set(allGroupLogs.map(log => log.date)).size} days</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}