export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  members: string[]; // Array of user IDs
}