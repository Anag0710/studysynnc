import { useState, useEffect } from 'react';
import { User } from '../../models/User';
import { useGroup } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import studyService from '../../services/StudyService';

interface LeaderboardUser {
  id: string;
  username: string;
  totalTime: number;
  streak: number;
  topicsCount: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { group, hasGroup } = useGroup();
  const { user: currentUser } = useAuth();
  const { theme } = useTheme();
  
  useEffect(() => {
    if (!hasGroup || !group || !currentUser) {
      setUsers([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // Get leaderboard data from StudyService
      const leaderboardData = studyService.getLeaderboardData(group.id);
      
      // Get all logs to find unique topics
      const allLogs = studyService.getAllLogs();
      
      // Create user objects with stats
      const userObjects: LeaderboardUser[] = leaderboardData.map(entry => {
        // Get all logs for this user to count topics
        const userLogs = allLogs.filter(log => log.userId === entry.userId);
        const uniqueTopics = new Set();
        userLogs.forEach(log => {
          log.topics.forEach(topic => uniqueTopics.add(topic));
        });
        
        const isCurrentUser = entry.userId === currentUser.id;
        
        return {
          id: entry.userId,
          username: isCurrentUser ? currentUser.username || 'You' : `User ${entry.userId.slice(0, 4)}`,
          totalTime: entry.totalTime,
          streak: entry.streak,
          topicsCount: uniqueTopics.size
        };
      });
      
      setUsers(userObjects);
    } catch (error) {
      console.error("Error fetching leaderboard data:", error);
      
      // Fallback to dummy data if there's an error
      if (currentUser) {
        setUsers([
          {
            id: currentUser.id,
            username: 'You',
            totalTime: 120,
            streak: 3,
            topicsCount: 2
          },
          {
            id: '2',
            username: 'studybuddy',
            totalTime: 90,
            streak: 5,
            topicsCount: 3
          }
        ]);
      }
    } finally {
      setLoading(false);
    }
  }, [group, hasGroup, currentUser]);

  const sortedUsers = [...users].sort((a, b) => b.totalTime - a.totalTime);

  if (!hasGroup) {
    return (
      <div className="card p-6 transition-all duration-300 animate-fadeIn">
        <h3 className="text-lg font-medium leading-6 text-[var(--text-primary)]">Group Leaderboard</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">
          Join or create a study group to see the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="card shadow-lg transition-all duration-300 animate-fadeIn overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-[var(--text-primary)]">Group Leaderboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-[var(--text-secondary)]">
          See how your study progress compares with your group members.
        </p>
      </div>
      
      {loading ? (
        <div className="px-4 py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[var(--primary)]"></div>
        </div>
      ) : (
        <div className="border-t border-[var(--border)]">
          <ul className="divide-y divide-[var(--border)]">
            {sortedUsers.map((user, index) => {
              const isCurrentUser = user.id === currentUser?.id;
              const percentComplete = Math.min(100, (user.totalTime / Math.max(...users.map(u => u.totalTime))) * 100);
              
              return (
                <li 
                  key={user.id} 
                  className={`px-4 py-4 sm:px-6 transition-all duration-300 ${
                    isCurrentUser ? 'bg-[var(--highlight-bg)]' : ''
                  } hover:bg-[var(--hover-bg)] animate-slideIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`font-medium w-7 text-center rounded-full h-7 flex items-center justify-center transition-transform transform hover:scale-110 ${
                        index === 0 ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-200' : 
                        index === 1 ? 'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200' : 
                        index === 2 ? 'bg-amber-700 text-amber-50 dark:bg-amber-600 dark:text-amber-200' : 
                        'bg-[var(--badge-bg)] text-[var(--badge-text)]'
                      }`}>{index + 1}</div>
                      <span className={`ml-3 font-medium ${isCurrentUser ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'}`}>
                        {isCurrentUser ? 'You' : user.username}
                      </span>
                      {isCurrentUser && (
                        <span className="ml-2 text-xs bg-[var(--primary)] text-white px-2 py-0.5 rounded-full">You</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-[var(--text-secondary)] text-sm">
                        <span className="font-medium text-[var(--text-primary)]">{studyService.formatStudyTime(user.totalTime)}</span>
                      </div>
                      <div className="flex items-center text-[var(--text-secondary)] text-sm">
                        <span className="font-medium text-[var(--text-primary)] mr-1">{user.streak}</span> 
                        <span>day streak</span>
                        {user.streak >= 3 && (
                          <span className="ml-1 text-orange-500 dark:text-orange-400">🔥</span>
                        )}
                      </div>
                      <div className="text-[var(--text-secondary)] text-sm">
                        <span className="font-medium text-[var(--text-primary)]">{user.topicsCount}</span> topics
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-[var(--progress-bg)] rounded-full h-2.5 overflow-hidden">
                      <div 
                        className={`${isCurrentUser ? 'bg-[var(--primary)]' : 'bg-indigo-600 dark:bg-indigo-500'} h-2.5 rounded-full transition-all duration-1000 ease-out`} 
                        style={{ width: `${percentComplete}%` }}
                      ></div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {!loading && users.length === 0 && (
        <div className="px-4 py-10 text-center text-[var(--text-secondary)] animate-fadeIn">
          <div className="mb-3">📊</div>
          <p>No users in this group yet.</p>
          <p className="text-sm mt-1">Start logging study time to see the rankings!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;