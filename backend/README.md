# Todo List Backend

A simple Express.js backend for the Todo List application.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following content:
```
PORT=3001
NODE_ENV=development
```

## Development

To run the server in development mode:
```bash
npm run dev
```

## Production

To build and run the server in production mode:
```bash
npm run build
npm start
```

## API Endpoints

### GET /api/todos
Get all todos

### POST /api/todos
Create a new todo
```json
{
  "text": "Task description",
  "dueDate": "2024-03-20T00:00:00.000Z", // optional
  "priority": "high" // optional: "low" | "medium" | "high"
}
```

### PUT /api/todos/:id
Update a todo
```json
{
  "text": "Updated task",
  "completed": true,
  "dueDate": "2024-03-21T00:00:00.000Z",
  "priority": "medium"
}
```

### DELETE /api/todos/:id
Delete a todo 