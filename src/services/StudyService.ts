import { Log } from '../models/Log';

class StudyService {
  constructor() {
    // Initialize localStorage if it doesn't exist
    // We'll initialize storage when it's needed to avoid SSR issues
  }

  private initializeStorage(): void {
    if (typeof window === 'undefined') return;
    
    if (!localStorage.getItem('studyLogs')) {
      localStorage.setItem('studyLogs', JSON.stringify([]));
    }
  }

  // Add a new study log
  addLog(log: Log): void {
    if (typeof window === 'undefined') return;
    
    // Make sure storage is initialized
    this.initializeStorage();
    
    const logs = this.getAllLogs();
    logs.push(log);
    localStorage.setItem('studyLogs', JSON.stringify(logs));
  }

  // Get all logs
  getAllLogs(): Log[] {
    if (typeof window === 'undefined') return [];
    
    // Make sure storage is initialized
    this.initializeStorage();
    
    try {
      const logsString = localStorage.getItem('studyLogs');
      return logsString ? JSON.parse(logsString) : [];
    } catch (error) {
      console.error('Error retrieving logs:', error);
      return [];
    }
  }

  // Get logs for a specific user
  getUserLogs(userId: string): Log[] {
    return this.getAllLogs().filter(log => log.userId === userId);
  }

  // Get logs for a specific date
  getLogsByDate(userId: string, date: string): Log[] {
    return this.getUserLogs(userId).filter(log => log.date === date);
  }

  // Get today's logs for a user
  getTodayLogs(userId: string): Log[] {
    const today = new Date().toISOString().split('T')[0];
    return this.getLogsByDate(userId, today);
  }

  // Get logs for the current week
  getCurrentWeekLogs(userId: string): Log[] {
    const logs = this.getUserLogs(userId);
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    return logs.filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate >= startOfWeek;
    });
  }
  
  // Get logs for the current month
  getCurrentMonthLogs(userId: string): Log[] {
    const logs = this.getUserLogs(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return logs.filter(log => {
      const logDate = new Date(log.date + 'T00:00:00');
      return logDate >= startOfMonth;
    });
  }

  // Calculate streak (consecutive days of study)
  getStreak(userId: string): number {
    const logs = this.getUserLogs(userId);
    if (logs.length === 0) return 0;
    
    // Extract unique dates and sort them in descending order (newest first)
    const uniqueDates = Array.from(new Set(logs.map(log => log.date)));
    const sortedDates = uniqueDates.sort((a, b) => {
      // Compare dates as strings in reverse order (newest first)
      return b.localeCompare(a);
    });
    
    if (sortedDates.length === 0) return 0;
    
    const today = new Date().toISOString().split('T')[0];
    // If no study today, streak is 0
    if (sortedDates[0] !== today) return 0;
    
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const currentDate = new Date(sortedDates[i-1]);
      const previousDate = new Date(sortedDates[i]);
      
      // Calculate difference between days
      const diffTime = currentDate.getTime() - previousDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  }

  // Calculate total time studied for a collection of logs
  calculateTotalTime(logs: Log[]): number {
    return logs.reduce((total, log) => total + log.timeStudied, 0);
  }

  // Get user's quick stats
  getQuickStats(userId: string) {
    const todayLogs = this.getTodayLogs(userId);
    const weekLogs = this.getCurrentWeekLogs(userId);
    const monthLogs = this.getCurrentMonthLogs(userId);
    const streak = this.getStreak(userId);
    
    return {
      today: {
        totalMinutes: this.calculateTotalTime(todayLogs),
        count: todayLogs.length
      },
      week: {
        totalMinutes: this.calculateTotalTime(weekLogs),
        count: weekLogs.length
      },
      month: {
        totalMinutes: this.calculateTotalTime(monthLogs),
        count: monthLogs.length
      },
      streak: streak
    };
  }

  // Get leaderboard data for a group
  getLeaderboardData(groupId: string): {userId: string, totalTime: number, streak: number}[] {
    const logs = this.getAllLogs().filter(log => log.groupId === groupId);
    
    // Group logs by user
    const userStats = logs.reduce((stats, log) => {
      if (!stats[log.userId]) {
        stats[log.userId] = {
          userId: log.userId,
          totalTime: 0,
          streak: 0
        };
      }
      
      stats[log.userId].totalTime += log.timeStudied;
      return stats;
    }, {} as {[key: string]: {userId: string, totalTime: number, streak: number}});
    
    // Calculate streak for each user
    Object.keys(userStats).forEach(userId => {
      userStats[userId].streak = this.getStreak(userId);
    });
    
    // Convert to array and sort by total time descending
    return Object.values(userStats).sort((a, b) => b.totalTime - a.totalTime);
  }
  
  // Get user's rank in their group
  getUserRank(userId: string, groupId: string): number {
    const leaderboard = this.getLeaderboardData(groupId);
    const userIndex = leaderboard.findIndex(entry => entry.userId === userId);
    
    return userIndex === -1 ? leaderboard.length : userIndex + 1;
  }

  // Format minutes into hours and minutes
  formatStudyTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hr${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hr${hours > 1 ? 's' : ''} ${remainingMinutes} min`;
  }
}

// Create a singleton instance
const studyService = new StudyService();
export default studyService;