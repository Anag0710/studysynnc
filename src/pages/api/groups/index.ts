import type { NextApiRequest, NextApiResponse } from 'next';
import { Group } from '../../../models/Group';

// Mock database for groups
let groups: Group[] = [
  {
    id: '1',
    name: 'Study Champions',
    inviteCode: 'SC123',
    members: ['1']  // User IDs
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET request - fetch groups
  if (req.method === 'GET') {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Find the group this user belongs to
    const group = groups.find(g => g.members.includes(userId as string));
    
    if (!group) {
      return res.status(404).json({ message: 'No group found for this user' });
    }
    
    return res.status(200).json(group);
  }
  
  // POST request - create a new group
  if (req.method === 'POST') {
    const { name, userId } = req.body;
    
    if (!name || !userId) {
      return res.status(400).json({ message: 'Group name and user ID are required' });
    }
    
    // Generate a random invite code (in real app, ensure it's unique)
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newGroup: Group = {
      id: (groups.length + 1).toString(),
      name,
      inviteCode,
      members: [userId]
    };
    
    groups.push(newGroup);
    
    return res.status(201).json(newGroup);
  }
  
  // PUT request - join a group
  if (req.method === 'PUT') {
    const { inviteCode, userId } = req.body;
    
    if (!inviteCode || !userId) {
      return res.status(400).json({ message: 'Invite code and user ID are required' });
    }
    
    // Find the group with this invite code
    const groupIndex = groups.findIndex(g => g.inviteCode === inviteCode);
    
    if (groupIndex === -1) {
      return res.status(404).json({ message: 'Group not found with this invite code' });
    }
    
    // Check if the group is full (max 6 members)
    if (groups[groupIndex].members.length >= 6) {
      return res.status(400).json({ message: 'Group is already full (max 6 members)' });
    }
    
    // Check if user is already in this group
    if (groups[groupIndex].members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }
    
    // Add user to the group
    groups[groupIndex].members.push(userId);
    
    return res.status(200).json(groups[groupIndex]);
  }
  
  // Method not allowed for other HTTP methods
  return res.status(405).json({ message: 'Method not allowed' });
}