import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Todo } from "../types/todo";

type AddTodoDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleAddTodo: (todo: Omit<Todo, "id">) => void;
  newTodo: {
    id?: number;
    text: string;
    description?: string;
    completed?: boolean;
    createdAt?: string;
    dueDate?: string;
    priority: "low" | "medium" | "high";
  };
  setNewTodo: (todo: any) => void;
};

function AddTodoDialog({
  open,
  setOpen,
  handleAddTodo,
  newTodo,
  setNewTodo,
}: AddTodoDialogProps) {
  const handlePriorityChange = (event: SelectChangeEvent) => {
    setNewTodo({
      ...newTodo,
      priority: event.target.value as Todo["priority"],
    });
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Add Todo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Todo Text"
          fullWidth
          variant="outlined"
          onChange={(e) => setNewTodo({ ...newTodo, text: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          variant="outlined"
          onChange={(e) =>
            setNewTodo({ ...newTodo, description: e.target.value })
          }
        />
        <InputLabel>Priority</InputLabel>
        <Select
          margin="dense"
          label="Priority"
          fullWidth
          variant="outlined"
          onChange={handlePriorityChange}
          sx={{ mb: 2 }}
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Due Date"
            value={newTodo.dueDate ? new Date(newTodo.dueDate) : null}
            onChange={(date) => {
              setNewTodo({
                ...newTodo,
                dueDate: date ? date.toISOString() : "",
              });
            }}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          onClick={() => {
            handleAddTodo(newTodo as Omit<Todo, "id">);
          }}
          color="primary"
        >
          Add
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default AddTodoDialog;
