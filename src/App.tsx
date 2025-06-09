import {
  Box,
  Typography,
  Button,
  Stack,
  List,
  ListItem,
  Checkbox,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState, useEffect } from "react";
import AddTodoDialog from "./components/AddTodoDialog";
import { Todo } from "./types/todo";
import { api } from "./services/api";

type Filter = "all" | "active" | "completed";
type SortType = "priority";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [sortBy, setSortBy] = useState<SortType>("priority");
  const [newTodo, setNewTodo] = useState<Todo>({
    id: 0,
    text: "",
    description: "",
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: "",
    priority: "medium",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const toggleTodoCompletion = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      api
        .updateTodo(id.toString(), updatedTodo)
        .then(() => {
          setTodos((prevTodos) =>
            prevTodos.map((t) => (t.id === id ? updatedTodo : t))
          );
        })
        .catch((error) => {
          console.error("Error updating todo:", error);
        });
    }
  };

  const handleAddTodo = (todo: Omit<Todo, "id">) => {
    console.log("Adding todo:", todo);
    api
      .createTodo(todo as Todo) // The API will assign the ID
      .then(() => {
        // Refetch todos to get the updated list with proper IDs
        return api.getTodos();
      })
      .then((updatedTodos) => {
        setTodos(updatedTodos);
        setOpen(false);
        // Reset the form
        setNewTodo({
          id: 0,
          text: "",
          description: "",
          completed: false,
          createdAt: new Date().toISOString(),
          dueDate: "",
          priority: "medium",
        });
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  const handleDelete = (id: number) => {
    api
      .deleteTodo(id.toString())
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: Filter
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortType);
  };

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "active") return !todo.completed;
      if (filter === "completed") return todo.completed;
      return true; // "all" filter
    })
    .sort((a, b) => {
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      } else if (sortBy === "dueDate") {
        if (!a.dueDate || !b.dueDate) return 0; // If no due date, don't sort
        const dateA = new Date(a.dueDate);
        const dateB = new Date(b.dueDate);
        return dateA.getTime() - dateB.getTime();
      }
      return 0; // Default case, no sorting
    });

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await api.getTodos();
        console.log("Fetched todos:", response);
        setTodos(response);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    fetchTodos();
  }, []);

  return (
    <Box
      sx={{
        p: 2,
        mx: "auto",
      }}
    >
      <AddTodoDialog
        open={open}
        setOpen={setOpen}
        handleAddTodo={handleAddTodo}
        newTodo={newTodo}
        setNewTodo={setNewTodo}
      />
      <Typography variant="h4">Todo List</Typography>
      <Stack direction="row" spacing={3}>
        <Button variant="contained" onClick={handleOpen}>
          Add Todo
        </Button>

        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          size="small"
          sx={{ mb: 2 }}
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select label="Sort By" onChange={handleSortChange} value={sortBy}>
            <MenuItem value="dueDate">Due Date</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="">None</MenuItem>
          </Select>
        </FormControl>
      </Stack>
      <List>
        {filteredTodos.map((todo) => (
          <ListItem key={todo.id}>
            <Checkbox
              checked={todo.completed}
              onChange={() => toggleTodoCompletion(todo.id)}
              sx={{
                color: todo.completed ? "green" : "grey",
                "&.Mui-checked": {
                  color: "success.main",
                },
              }}
            />
            <Typography variant="body1">{todo.text}</Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDelete(todo.id)}
            >
              Delete
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}

export default App;
