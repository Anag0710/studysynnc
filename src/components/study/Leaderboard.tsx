import { useState, useEffect } from 'react';
import { User } from '../../models/User';
import { useGroup } from '../../contexts/GroupContext';
import { useAuth } from '../../contexts/AuthContext';

interface LeaderboardUser extends Omit<User, 'passwordHash'> {
  totalTime: number;
  streak: number;
  topicsCount: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { group, hasGroup } = useGroup();
  const { user: currentUser } = useAuth();
  
  useEffect(() => {
    // In a real app, fetch group members and their stats from API
    if (hasGroup && group) {
      setLoading(true);
      
      // Mock API call
      setTimeout(() => {
        // Generate mockup data based on actual group members
        const mockUsers: LeaderboardUser[] = group.members.map((memberId, index) => {
          const isCurrentUser = memberId === currentUser?.id;
          return {
            id: memberId,
            username: isCurrentUser ? currentUser?.username || 'You' : `User ${index + 1}`,
            groupId: group.id,
            totalTime: Math.floor(Math.random() * 300) + (isCurrentUser ? 100 : 50), // Current user gets a boost
            streak: Math.floor(Math.random() * 7) + (isCurrentUser ? 2 : 0),
            topicsCount: Math.floor(Math.random() * 5) + (isCurrentUser ? 1 : 0)
          };
        });
        
        setUsers(mockUsers);
        setLoading(false);
      }, 500);
    } else {
      setUsers([]);
      setLoading(false);
    }
  }, [group, hasGroup, currentUser]);

  const sortedUsers = [...users].sort((a, b) => b.totalTime - a.totalTime);

  if (!hasGroup) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Group Leaderboard</h3>
        <p className="mt-2 text-sm text-gray-500">
          Join or create a study group to see the leaderboard.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Group Leaderboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          See how your study progress compares with your group members.
        </p>
      </div>
      
      {loading ? (
        <div className="px-4 py-10 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="border-t border-gray-200">
          <ul>
            {sortedUsers.map((user, index) => {
              const isCurrentUser = user.id === currentUser?.id;
              return (
                <li 
                  key={user.id} 
                  className={`px-4 py-4 sm:px-6 border-b border-gray-200 last:border-b-0 ${
                    isCurrentUser ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`font-medium w-6 text-center rounded-full h-6 flex items-center justify-center ${
                        index === 0 ? 'bg-yellow-200 text-yellow-800' : 
                        index === 1 ? 'bg-gray-200 text-gray-800' : 
                        index === 2 ? 'bg-amber-700 text-amber-50' : 'text-indigo-600'
                      }`}>{index + 1}</div>
                      <span className={`ml-3 font-medium ${isCurrentUser ? 'text-blue-700' : 'text-gray-900'}`}>
                        {isCurrentUser ? 'You' : user.username}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-gray-500 text-sm">
                        <span className="font-medium text-gray-900">{user.totalTime}</span> min
                      </div>
                      <div className="text-gray-500 text-sm">
                        <span className="font-medium text-gray-900">{user.streak}</span> day streak
                      </div>
                      <div className="text-gray-500 text-sm">
                        <span className="font-medium text-gray-900">{user.topicsCount}</span> topics
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`${isCurrentUser ? 'bg-blue-600' : 'bg-indigo-600'} h-2.5 rounded-full`} 
                        style={{ width: `${Math.min(100, (user.totalTime / Math.max(...users.map(u => u.totalTime))) * 100)}%` }}
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
        <div className="px-4 py-5 text-center text-gray-500">
          No users in this group yet.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;