export interface Log {
  id: string;
  userId: string;
  groupId: string;
  date: string; // Format: YYYY-MM-DD
  topics: string[];
  timeStudied: number; // in minutes
  confidence: number; // 1-10 scale
}