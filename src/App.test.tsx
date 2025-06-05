import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import App from './App';
import { api } from './services/api';

// Mock the API service
jest.mock('./services/api', () => ({
  api: {
    getTodos: jest.fn(),
    createTodo: jest.fn(),
    updateTodo: jest.fn(),
    deleteTodo: jest.fn(),
  },
}));

// Mock the date-fns adapter
jest.mock('@mui/x-date-pickers/AdapterDateFns', () => ({
  __esModule: true,
  default: class MockAdapter {
    format = jest.fn();
    parse = jest.fn();
    isValid = jest.fn();
    isEqual = jest.fn();
    isAfter = jest.fn();
    isBefore = jest.fn();
    isAfterDay = jest.fn();
    isBeforeDay = jest.fn();
    isAfterMonth = jest.fn();
    isBeforeMonth = jest.fn();
    isAfterYear = jest.fn();
    isBeforeYear = jest.fn();
    startOfMonth = jest.fn();
    endOfMonth = jest.fn();
    startOfWeek = jest.fn();
    endOfWeek = jest.fn();
    getNextMonth = jest.fn();
    getPreviousMonth = jest.fn();
    getMonthArray = jest.fn();
    getWeekdays = jest.fn();
    getWeekArray = jest.fn();
    getYearRange = jest.fn();
    getYear = jest.fn();
    getMonth = jest.fn();
    getDate = jest.fn();
    getHours = jest.fn();
    getMinutes = jest.fn();
    getSeconds = jest.fn();
    getMilliseconds = jest.fn();
    setYear = jest.fn();
    setMonth = jest.fn();
    setDate = jest.fn();
    setHours = jest.fn();
    setMinutes = jest.fn();
    setSeconds = jest.fn();
    setMilliseconds = jest.fn();
    getTimezone = jest.fn();
    setTimezone = jest.fn();
    toISO = jest.fn();
    toJSDate = jest.fn();
    toJSON = jest.fn();
    toFormat = jest.fn();
    fromISO = jest.fn();
    fromJSDate = jest.fn();
    fromJSON = jest.fn();
    fromFormat = jest.fn();
  },
}));

const mockTodos = [
  {
    id: 1,
    text: 'Test Todo 1',
    description: 'Test Description 1',
    completed: false,
    createdAt: '2024-03-20T10:00:00.000Z',
    dueDate: '2024-03-25T10:00:00.000Z',
    priority: 'high' as const,
  },
  {
    id: 2,
    text: 'Test Todo 2',
    description: 'Test Description 2',
    completed: true,
    createdAt: '2024-03-19T10:00:00.000Z',
    priority: 'medium' as const,
  },
];

const renderApp = () => {
  return render(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <App />
    </LocalizationProvider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (api.getTodos as jest.Mock).mockResolvedValue(mockTodos);
  });

  it('renders the todo list with initial todos', async () => {
    renderApp();
    
    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
      expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    });
  });

  it('deletes a todo', async () => {
    (api.deleteTodo as jest.Mock).mockResolvedValue({});
    renderApp();

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByLabelText('delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByText('Delete');
    fireEvent.click(confirmButton);

    // Verify API call
    await waitFor(() => {
      expect(api.deleteTodo).toHaveBeenCalledWith('1');
    });
  });

  it('filters todos', async () => {
    renderApp();

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    // Click active filter
    const activeFilter = screen.getByText('Active');
    fireEvent.click(activeFilter);

    // Verify only active todos are shown
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.queryByText('Test Todo 2')).not.toBeInTheDocument();

    // Click completed filter
    const completedFilter = screen.getByText('Completed');
    fireEvent.click(completedFilter);

    // Verify only completed todos are shown
    expect(screen.queryByText('Test Todo 1')).not.toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('toggles todo completion', async () => {
    const updatedTodo = {
      ...mockTodos[0],
      completed: true,
    };

    (api.updateTodo as jest.Mock).mockResolvedValue(updatedTodo);
    renderApp();

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    });

    // Click todo to toggle completion
    const todoText = screen.getByText('Test Todo 1');
    fireEvent.click(todoText);

    // Verify API call
    await waitFor(() => {
      expect(api.updateTodo).toHaveBeenCalledWith('1', {
        completed: true,
      });
    });
  });

  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch todos';
    (api.getTodos as jest.Mock).mockRejectedValue(new Error(errorMessage));
    
    renderApp();

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
