export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  // Bonus features
  dueDate?: string;
  priority?: 'low' | 'medium' | 'high';
} 