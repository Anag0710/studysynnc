import type { NextApiRequest, NextApiResponse } from 'next';
import { Log } from '../../../models/Log';

// Mock database for logs
let logs: Log[] = [
  {
    id: '1',
    userId: '1',
    groupId: '1',
    date: '2025-04-30',
    topics: ['React', 'NextJS'],
    timeStudied: 120,
    confidence: 7
  },
  {
    id: '2',
    userId: '1',
    groupId: '1',
    date: '2025-04-29',
    topics: ['TypeScript'],
    timeStudied: 90,
    confidence: 6
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request - fetch logs for a user
  if (req.method === 'GET') {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find logs for this user
    const userLogs = logs.filter(log => log.userId === userId);
    
    return res.status(200).json(userLogs);
  }
  
  // POST request - create a new log entry
  if (req.method === 'POST') {
    const { userId, groupId, topics, timeStudied, confidence } = req.body;
    
    if (!userId || !timeStudied) {
      return res.status(400).json({ message: 'User ID and time studied are required' });
    }
    
    // Get current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    
    // Check if log for today already exists
    const existingLog = logs.find(log => log.userId === userId && log.date === today);
    
    if (existingLog) {
      // Update existing log
      const updatedLog = {
        ...existingLog,
        topics: topics || existingLog.topics,
        timeStudied: (existingLog.timeStudied || 0) + timeStudied,
        confidence: confidence !== undefined ? confidence : existingLog.confidence
      };
      
      logs = logs.map(log => log.id === existingLog.id ? updatedLog : log);
      
      return res.status(200).json(updatedLog);
    } else {
      // Create new log
      const newLog: Log = {
        id: (logs.length + 1).toString(),
        userId,
        groupId: groupId || '',
        date: today,
        topics: topics || ['Study Session'],
        timeStudied,
        confidence: confidence || 5
      };
      
      logs.push(newLog);
      
      return res.status(201).json(newLog);
    }
  }
  
  // DELETE request - remove a log entry
  if (req.method === 'DELETE') {
    const { logId } = req.body;
    
    if (!logId) {
      return res.status(400).json({ message: 'Log ID is required' });
    }
    
    const logIndex = logs.findIndex(log => log.id === logId);
    
    if (logIndex === -1) {
      return res.status(404).json({ message: 'Log not found' });
    }
    
    logs.splice(logIndex, 1);
    
    return res.status(200).json({ message: 'Log deleted successfully' });
  }
  
  // Method not allowed for other HTTP methods
  return res.status(405).json({ message: 'Method not allowed' });
}