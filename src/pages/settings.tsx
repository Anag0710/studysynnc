import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../components/Layout';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [hasGroup, setHasGroup] = useState(false);
  const [groupInfo, setGroupInfo] = useState<{name: string, members: string[], inviteCode: string} | null>(null);
  
  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    
    if (user) {
      setUsername(user.username);
      
      // Check if user has a group
      if (user.groupId) {
        setHasGroup(true);
        
        // In a real app, you would fetch group info from API
        // fetchGroupInfo(user.groupId)
        
        // For now, we'll use dummy data
        setGroupInfo({
          name: 'Study Champions',
          members: ['currentUser', 'studybuddy'],
          inviteCode: 'SC123'
        });
      }
    }
  }, [user, loading, router]);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would call an API to update the profile
      // await updateProfile(username, currentPassword)
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to update profile.', type: 'error' });
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setMessage({ text: 'Passwords do not match.', type: 'error' });
      return;
    }
    
    try {
      // In a real app, you would call an API to change the password
      // await changePassword(currentPassword, newPassword)
      
      setMessage({ text: 'Password changed successfully!', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to change password.', type: 'error' });
    }
  };
  
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would call an API to create a group
      // const group = await createGroup(groupName)
      
      // For now, we'll simulate success
      setHasGroup(true);
      setGroupInfo({
        name: groupName,
        members: ['currentUser'],
        inviteCode: 'NEW123'
      });
      setMessage({ text: 'Study group created successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to create group.', type: 'error' });
    }
  };
  
  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, you would call an API to join a group
      // const group = await joinGroup(inviteCode)
      
      // For now, we'll simulate success
      setHasGroup(true);
      setGroupInfo({
        name: 'Study Wizards',
        members: ['existingMember', 'currentUser'],
        inviteCode: inviteCode
      });
      setMessage({ text: 'Joined study group successfully!', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to join group. Invalid invite code.', type: 'error' });
    }
  };
  
  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) {
      return;
    }
    
    try {
      // In a real app, you would call an API to leave the group
      // await leaveGroup()
      
      // For now, we'll simulate success
      setHasGroup(false);
      setGroupInfo(null);
      setMessage({ text: 'Left study group successfully.', type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      setMessage({ text: 'Failed to leave group.', type: 'error' });
    }
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
        <title>Settings | StudySync</title>
      </Head>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
        
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold mb-4">Update Profile</h2>
              <form onSubmit={handleUpdateProfile}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password (to confirm changes)
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Update Profile
                </button>
              </form>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Change Password</h2>
              <form onSubmit={handleChangePassword}>
                <div className="mb-4">
                  <label htmlFor="currentPasswordForChange" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPasswordForChange"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
          
          <div>
            {!hasGroup ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Study Group</h2>
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-2">Create a New Group</h3>
                  <form onSubmit={handleCreateGroup}>
                    <div className="mb-4">
                      <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-1">
                        Group Name
                      </label>
                      <input
                        type="text"
                        id="groupName"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Create Group
                    </button>
                  </form>
                </div>
                
                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Join Existing Group</h3>
                  <form onSubmit={handleJoinGroup}>
                    <div className="mb-4">
                      <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Invite Code
                      </label>
                      <input
                        type="text"
                        id="inviteCode"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                    >
                      Join Group
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">Your Study Group</h2>
                
                {groupInfo && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-1">Group Name</h3>
                      <p className="text-gray-700">{groupInfo.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-1">Invite Code</h3>
                      <div className="flex items-center">
                        <code className="bg-gray-100 px-2 py-1 rounded mr-2">{groupInfo.inviteCode}</code>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(groupInfo.inviteCode);
                            setMessage({ text: 'Invite code copied to clipboard!', type: 'success' });
                            setTimeout(() => setMessage({ text: '', type: '' }), 3000);
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Copy
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        Share this code with friends so they can join your group
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-1">Members ({groupInfo.members.length}/6)</h3>
                      <ul className="bg-gray-50 rounded-md p-2">
                        {groupInfo.members.map((member, index) => (
                          <li key={index} className="py-1 px-2">
                            {member}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="pt-4">
                      <button
                        onClick={handleLeaveGroup}
                        className="text-red-600 hover:text-red-800"
                      >
                        Leave Group
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}