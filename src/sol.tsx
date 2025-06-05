import React, { useState, useEffect } from 'react';
import { Todo } from './types/todo';
import { api } from './services/api';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Typography,
  Box,
  Paper,
  Checkbox,
  DialogContentText,
  Divider,
  Chip,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FlagIcon from '@mui/icons-material/Flag';
import EditIcon from '@mui/icons-material/Edit';
import './App.css';

type FilterType = 'all' | 'active' | 'completed';
type SortType = 'date' | 'priority' | 'dueDate';
type PriorityType = 'low' | 'medium' | 'high';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    dueDate: null as Date | null,
    priority: 'medium' as PriorityType,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('date');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  const [editDescription, setEditDescription] = useState('');
  const [editDueDate, setEditDueDate] = useState<Date | null>(null);
  const [editPriority, setEditPriority] = useState<PriorityType>('medium');

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewTodo({ title: '', description: '', dueDate: null, priority: 'medium' });
    setFormError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newTodo.title.trim()) {
      setFormError('Title cannot be empty');
      return;
    }

    try {
      const todo = await api.createTodo({
        text: newTodo.title.trim(),
        description: newTodo.description.trim(),
        completed: false,
        dueDate: newTodo.dueDate?.toISOString(),
        priority: newTodo.priority,
      });
      setTodos([...todos, todo]);
      handleClose();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    }
  };

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await api.getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch todos');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    try {
      const updatedTodo = await api.updateTodo(id.toString(), {
        completed: !todo.completed,
      });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const handleDeleteClick = (todo: Todo) => {
    setTodoToDelete(todo);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!todoToDelete) return;

    try {
      await api.deleteTodo(todoToDelete.id.toString());
      setTodos(todos.filter(t => t.id !== todoToDelete.id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    } finally {
      setDeleteDialogOpen(false);
      setTodoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTodoToDelete(null);
  };

  const handleFilterChange = (
    event: React.MouseEvent<HTMLElement>,
    newFilter: FilterType,
  ) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleSortChange = (event: SelectChangeEvent) => {
    setSortBy(event.target.value as SortType);
  };

  const handlePriorityChange = (event: SelectChangeEvent) => {
    setNewTodo({ ...newTodo, priority: event.target.value as PriorityType });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleEditClick = (todo: Todo) => {
    setTodoToEdit(todo);
    setEditDescription(todo.description || '');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate) : null);
    setEditPriority(todo.priority);
    setEditDialogOpen(true);
  };

  const handleEditClose = () => {
    setEditDialogOpen(false);
    setTodoToEdit(null);
    setEditDescription('');
    setEditDueDate(null);
    setEditPriority('medium');
  };

  const handleEditSubmit = async () => {
    if (!todoToEdit) return;

    try {
      const updatedTodo = await api.updateTodo(todoToEdit.id.toString(), {
        description: editDescription.trim(),
        dueDate: editDueDate?.toISOString(),
        priority: editPriority,
      });
      setTodos(todos.map(t => t.id === todoToEdit.id ? updatedTodo : t));
      setError(null);
      handleEditClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    }
  };

  const filteredAndSortedTodos = [...todos]
    .filter(todo => {
      switch (filter) {
        case 'active':
          return !todo.completed;
        case 'completed':
          return todo.completed;
        default:
          return true;
      }
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority': {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case 'dueDate': {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <Box className="App" sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Todo List
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClickOpen}
        >
          Add New Todo
        </Button>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="active">Active</ToggleButton>
          <ToggleButton value="completed">Completed</ToggleButton>
        </ToggleButtonGroup>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            <MenuItem value="date">Date Created</MenuItem>
            <MenuItem value="priority">Priority</MenuItem>
            <MenuItem value="dueDate">Due Date</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Todo</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                autoFocus
                label="Title"
                type="text"
                fullWidth
                value={newTodo.title}
                onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                error={!!formError}
                helperText={formError}
                required
              />
              <TextField
                label="Description"
                multiline
                rows={4}
                fullWidth
                value={newTodo.description}
                onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
              />
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={newTodo.dueDate}
                  onChange={(date) => setNewTodo({ ...newTodo, dueDate: date })}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </LocalizationProvider>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTodo.priority}
                  label="Priority"
                  onChange={handlePriorityChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">Add Todo</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
      >
        <DialogTitle id="delete-dialog-title">
          Delete Todo
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{todoToDelete?.text}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Todo</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
              autoFocus
              label="Description"
              multiline
              rows={4}
              fullWidth
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Due Date"
                value={editDueDate}
                onChange={(date) => setEditDueDate(date)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={editPriority}
                label="Priority"
                onChange={(e) => setEditPriority(e.target.value as PriorityType)}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditClose}>Cancel</Button>
          <Button onClick={handleEditSubmit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={2}>
        <List>
          {filteredAndSortedTodos.map((todo, index) => (
            <React.Fragment key={todo.id}>
              {index > 0 && <Divider />}
              <ListItem
                sx={{
                  opacity: todo.completed ? 0.7 : 1,
                  bgcolor: todo.completed ? 'action.hover' : 'background.paper',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                  py: 2,
                }}
              >
                <Checkbox
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  sx={{
                    '&.Mui-checked': {
                      color: 'success.main',
                    },
                  }}
                />
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                      <Typography
                        variant="body1"
                        sx={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? 'text.secondary' : 'text.primary',
                          transition: 'all 0.2s ease-in-out',
                          fontWeight: todo.completed ? 'normal' : 500,
                        }}
                      >
                        {todo.text}
                      </Typography>
                      <Chip
                        size="small"
                        icon={<FlagIcon />}
                        label={todo.priority}
                        color={getPriorityColor(todo.priority)}
                        variant="outlined"
                      />
                      {todo.dueDate && (
                        <Chip
                          size="small"
                          icon={<AccessTimeIcon />}
                          label={formatDate(todo.dueDate)}
                          variant="outlined"
                          color={new Date(todo.dueDate) < new Date() ? 'error' : 'default'}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      component="span"
                      sx={{
                        color: todo.completed ? 'text.disabled' : 'text.secondary',
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        transition: 'all 0.2s ease-in-out',
                        mt: 0.5,
                        display: 'block',
                      }}
                    >
                      {todo.description}
                    </Typography>
                  }
                  onClick={() => toggleTodo(todo.id)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      '& .MuiTypography-root': {
                        color: todo.completed ? 'text.secondary' : 'primary.main',
                      },
                    },
                  }}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleEditClick(todo)}
                    sx={{
                      color: 'primary.main',
                      mr: 1,
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'primary.contrastText',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteClick(todo)}
                    sx={{
                      color: 'error.main',
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: 'error.contrastText',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </React.Fragment>
          ))}
          {todos.length === 0 && (
            <ListItem>
              <ListItemText
                primary={
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    align="center"
                    sx={{ py: 4 }}
                  >
                    No todos yet. Add one to get started!
                  </Typography>
                }
              />
            </ListItem>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default App;
