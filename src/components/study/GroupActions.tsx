import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useGroup } from '../../contexts/GroupContext';

type Message = {
  text: string;
  type: 'success' | 'error' | '';
};

export default function GroupActions() {
  const [groupName, setGroupName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [message, setMessage] = useState<Message>({ text: '', type: '' });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const router = useRouter();
  const { createGroup, joinGroup, hasGroup, group } = useGroup();

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await createGroup(groupName);
      
      if (success) {
        setMessage({ text: 'Study group created successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        setShowCreateModal(false);
        router.push('/dashboard');
      } else {
        setMessage({ text: 'Failed to create group.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to create group.', type: 'error' });
    }
  };
  
  const handleJoinGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const success = await joinGroup(inviteCode);
      
      if (success) {
        setMessage({ text: 'Joined study group successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
        setShowJoinModal(false);
        router.push('/dashboard');
      } else {
        setMessage({ text: 'Failed to join group. Invalid invite code.', type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Failed to join group. Invalid invite code.', type: 'error' });
    }
  };

  // If user already has a group, show group info instead of create/join buttons
  if (hasGroup && group) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-4">
        <h2 className="text-xl font-bold mb-4">Your Study Group</h2>
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Group Name</h3>
          <p className="bg-gray-50 p-2 rounded">{group.name}</p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-1">Invite Code</h3>
          <div className="flex items-center">
            <code className="bg-gray-50 p-2 rounded mr-2 flex-grow">{group.inviteCode}</code>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(group.inviteCode);
                setMessage({ text: 'Invite code copied!', type: 'success' });
                setTimeout(() => setMessage({ text: '', type: '' }), 3000);
              }}
              className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Share this code with friends so they can join your group
          </p>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-1">Members ({group.members.length}/6)</h3>
          <ul className="bg-gray-50 rounded-md p-2">
            {group.members.map((member, index) => (
              <li key={index} className="py-1 px-2">
                {member}
              </li>
            ))}
          </ul>
        </div>
        
        {message.text && (
          <div className={`p-3 rounded mt-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md"
        >
          Create Group
        </button>
        <button 
          onClick={() => setShowJoinModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
        >
          Join Group
        </button>
      </div>

      {message.text && (
        <div className={`p-3 rounded mb-4 ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Create a New Group</h2>
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Join Existing Group</h2>
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
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                  Join Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}