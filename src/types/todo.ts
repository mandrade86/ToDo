export interface Todo {
  id: number;
  text: string;
  description?: string;
  completed: boolean;
  createdAt: string;
  // Bonus features
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
} 