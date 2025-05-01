import { User } from '../../models/User';

interface LeaderboardUser extends User {
  totalTime: number;
  streak: number;
  topicsCount: number;
}

interface LeaderboardProps {
  users: LeaderboardUser[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ users }) => {
  const sortedUsers = [...users].sort((a, b) => b.totalTime - a.totalTime);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Group Leaderboard</h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          See how your study progress compares with your group members.
        </p>
      </div>
      
      <div className="border-t border-gray-200">
        <ul>
          {sortedUsers.map((user, index) => (
            <li key={user.id} className="px-4 py-4 sm:px-6 border-b border-gray-200 last:border-b-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium text-indigo-600 w-6 text-center">{index + 1}</span>
                  <span className="ml-3 font-medium text-gray-900">{user.username}</span>
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
                    className="bg-indigo-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, (user.totalTime / Math.max(...users.map(u => u.totalTime))) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {users.length === 0 && (
        <div className="px-4 py-5 text-center text-gray-500">
          No users in this group yet.
        </div>
      )}
    </div>
  );
};

export default Leaderboard;