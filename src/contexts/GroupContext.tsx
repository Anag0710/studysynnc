import React, { createContext, useState, useContext, useEffect } from 'react';
import { Group } from '../models/Group';
import { useAuth } from './AuthContext';

interface GroupContextType {
  group: Group | null;
  loading: boolean;
  hasGroup: boolean;
  fetchGroupInfo: () => Promise<void>;
  createGroup: (groupName: string) => Promise<boolean>;
  joinGroup: (inviteCode: string) => Promise<boolean>;
  leaveGroup: () => Promise<boolean>;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasGroup, setHasGroup] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchGroupInfo();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchGroupInfo = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // In a real app, you would fetch the actual group data
      // const response = await fetch(`/api/groups?userId=${user.id}`);
      // const data = await response.json();
      
      // Simulate API call for now
      const mockResponse = user.groupId ? {
        id: '1',
        name: 'Study Champions',
        inviteCode: 'SC123',
        members: ['1', '2']
      } : null;
      
      if (mockResponse) {
        setGroup(mockResponse);
        setHasGroup(true);
      } else {
        setGroup(null);
        setHasGroup(false);
      }
    } catch (error) {
      console.error('Error fetching group info:', error);
      setGroup(null);
      setHasGroup(false);
    } finally {
      setLoading(false);
    }
  };

  const createGroup = async (groupName: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // In a real app, you would call the API
      // const response = await fetch('/api/groups', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name: groupName, userId: user.id })
      // });
      // const data = await response.json();
      
      // Mock success
      const mockResponse = {
        id: '2',
        name: groupName,
        inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
        members: [user.id]
      };
      
      setGroup(mockResponse);
      setHasGroup(true);
      return true;
    } catch (error) {
      console.error('Error creating group:', error);
      return false;
    }
  };

  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      // In a real app, you would call the API
      // const response = await fetch('/api/groups', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ inviteCode, userId: user.id })
      // });
      // const data = await response.json();
      
      // Mock success
      const mockResponse = {
        id: '1',
        name: 'Study Champions',
        inviteCode: inviteCode,
        members: ['1', user.id]
      };
      
      setGroup(mockResponse);
      setHasGroup(true);
      return true;
    } catch (error) {
      console.error('Error joining group:', error);
      return false;
    }
  };

  const leaveGroup = async (): Promise<boolean> => {
    if (!user || !group) return false;
    
    try {
      // In a real app, you would call the API
      // const response = await fetch(`/api/groups/${group.id}/leave`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ userId: user.id })
      // });
      
      // Mock success
      setGroup(null);
      setHasGroup(false);
      return true;
    } catch (error) {
      console.error('Error leaving group:', error);
      return false;
    }
  };

  return (
    <GroupContext.Provider
      value={{
        group,
        loading,
        hasGroup,
        fetchGroupInfo,
        createGroup,
        joinGroup,
        leaveGroup
      }}
    >
      {children}
    </GroupContext.Provider>
  );
}

export function useGroup() {
  const context = useContext(GroupContext);
  if (context === undefined) {
    throw new Error('useGroup must be used within a GroupProvider');
  }
  return context;
}