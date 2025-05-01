import type { NextApiRequest, NextApiResponse } from 'next';

// In a real app, you would use a proper database
// This is just a mock for demo purposes
const users = [
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

  // Find the user
  const user = users.find(u => u.username === username);

  // Check if user exists and password matches
  // In a real app, you would use bcrypt to compare passwords
  if (!user || user.passwordHash !== password) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  // Don't send the password hash to the client
  const { passwordHash, ...userWithoutPassword } = user;

  // In a real app, you would use a proper session management or JWT
  return res.status(200).json(userWithoutPassword);
}