import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import CalendarLog from '../components/study/CalendarLog';
import { useAuth } from '../contexts/AuthContext';
import { Log } from '../models/Log';

export default function Calendar() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logs, setLogs] = useState<Log[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    // In a real app, fetch logs from API
    if (user) {
      // For now, we'll use dummy data
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
    }
  }, [user]);
  
  useEffect(() => {
    if (selectedDate) {
      const log = logs.find(log => log.date === selectedDate) || null;
      setSelectedLog(log);
    } else {
      setSelectedLog(null);
    }
  }, [selectedDate, logs]);
  
  const handleSelectDate = (date: string) => {
    setSelectedDate(date);
  };
  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
            <CalendarLog logs={logs} onSelectDate={handleSelectDate} />
          </div>
          
          <div>
            {selectedLog ? (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">{formatDate(selectedLog.date)}</h2>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Time Studied</h3>
                    <p className="text-gray-700">
                      {selectedLog.timeStudied} minutes
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Topics Covered</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedLog.topics.map((topic, index) => (
                        <span 
                          key={index} 
                          className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold">Confidence Level</h3>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                      <div 
                        className="bg-indigo-600 h-2.5 rounded-full" 
                        style={{ width: `${(selectedLog.confidence / 10) * 100}%` }}
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
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <p className="text-gray-500 text-center">
                  Select a day from the calendar to view details
                </p>
              </div>
            )}
            
            <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">Monthly Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-700">Total Study Time:</span>
                  <span className="font-semibold">
                    {logs.reduce((total, log) => total + log.timeStudied, 0)} minutes
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Study Days:</span>
                  <span className="font-semibold">{logs.length} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Average Daily Time:</span>
                  <span className="font-semibold">
                    {logs.length > 0 
                      ? Math.round(logs.reduce((total, log) => total + log.timeStudied, 0) / logs.length) 
                      : 0} minutes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}