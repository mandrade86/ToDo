import { Todo } from "../types/todo";

const baseUrl = "http://localhost:3001";
const mockTodos: Todo[] = [
  {
    id: 1,
    text: "Test Todo 1",
    description: "This is a test todo",
    completed: false,
    createdAt: "2025-06-09T04:00:00.000Z",
    dueDate: "2025-06-09T04:00:00.000Z",
    priority: "medium",
  },
  {
    id: 2,
    text: "Test Todo 2",
    description: "This is another test todo",
    completed: true,
    createdAt: "2025-06-09T04:00:00.000Z",
    dueDate: "2025-06-09T04:00:00.000Z",
    priority: "high",
  },
];

export const api = {
  getTodos: async () => {
    return new Promise<Todo[]>((resolve) => {
      setTimeout(() => {
        const localStorageTodos = localStorage.getItem("todos");
        if (localStorageTodos) {
          const todosFromStorage: Todo[] = JSON.parse(localStorageTodos);
          resolve(todosFromStorage);
        } else {
          resolve(mockTodos);
        }
      }, 1000); // Simulate network delay
    });
  },
  createTodo: async (todo: Todo) => {
    const localStorageTodos = localStorage.getItem("todos");
    let existingTodos: Todo[] = [];

    if (localStorageTodos) {
      existingTodos = JSON.parse(localStorageTodos);
    } else {
      existingTodos = [...mockTodos];
    }

    // Generate a unique ID
    const newId =
      existingTodos.length > 0
        ? Math.max(...existingTodos.map((t) => t.id)) + 1
        : 1;
    const newTodo = { ...todo, id: newId };

    const updatedTodos = [...existingTodos, newTodo];
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  },
  updateTodo: async (id: string, todo: Partial<Todo>) => {
    const localStorageTodos = localStorage.getItem("todos");
    if (localStorageTodos) {
      const todosFromStorage: Todo[] = JSON.parse(localStorageTodos);
      const updatedTodos = todosFromStorage.map((t) =>
        t.id.toString() === id ? { ...t, ...todo } : t
      );
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
  },
  deleteTodo: async (id: string) => {
    const localStorageTodos = localStorage.getItem("todos");
    if (localStorageTodos) {
      console.log("Deleting todo with id:", id);
      const todosFromStorage: Todo[] = JSON.parse(localStorageTodos);
      const updatedTodos = todosFromStorage.filter(
        (todo) => todo.id.toString() !== id
      );
      localStorage.setItem("todos", JSON.stringify(updatedTodos));
    }
  },
};
