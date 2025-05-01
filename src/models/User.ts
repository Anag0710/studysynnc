export interface User {
  id: string;
  username: string;
  passwordHash: string;
  groupId: string | null;
}