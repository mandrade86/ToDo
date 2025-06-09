import { Todo } from '../types/todo';

const API_URL = 'http://localhost:3001/api';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export const api = {
  async getTodos(): Promise<Todo[]> {
    try {
      const response = await fetch(`${API_URL}/todos`);
      if (!response.ok) {
        throw new ApiError('Failed to fetch todos', response.status);
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error while fetching todos');
    }
  },

  async createTodo(todo: Omit<Todo, 'id' | 'createdAt'>): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: todo.text,
          description: todo.description,
          dueDate: todo.dueDate,
          priority: todo.priority,
        }),
      });
      if (!response.ok) {
        throw new ApiError('Failed to create todo', response.status);
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error while creating todo');
    }
  },

  async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: todo.text,
          description: todo.description,
          completed: todo.completed,
          dueDate: todo.dueDate,
          priority: todo.priority,
        }),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Todo not found', 404);
        }
        throw new ApiError('Failed to update todo', response.status);
      }
      return response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error while updating todo');
    }
  },

  async deleteTodo(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new ApiError('Todo not found', 404);
        }
        throw new ApiError('Failed to delete todo', response.status);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error while deleting todo');
    }
  },
}; 