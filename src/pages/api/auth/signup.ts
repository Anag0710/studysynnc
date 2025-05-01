import type { NextApiRequest, NextApiResponse } from 'next';
import { User } from '../../../models/User';

// In a real app, you would use a proper database
// This is just a mock for demo purposes
const users: User[] = [
  {
    id: '1',
    username: 'demo',
    // In a real app, this would be a hashed password
    passwordHash: 'demo123', 
    groupId: '1'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
    return res.status(400).json({ message: 'Username already exists' });
  }

  // Create a new user
  const newUser: User = {
    id: (users.length + 1).toString(),
    username,
    // In a real app, this would be a hashed password
    passwordHash: password,
    groupId: null
  };

  // Add the user to our mock database
  users.push(newUser);

  // Don't send the password hash to the client
  const { passwordHash, ...userWithoutPassword } = newUser;

  // In a real app, you would use a proper session management or JWT
  return res.status(201).json(userWithoutPassword);
}