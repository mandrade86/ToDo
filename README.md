# Todo Application

A modern Todo application built with React, TypeScript, and Material-UI, featuring a clean and intuitive user interface.

## Features

- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Add descriptions to todos
- Set due dates for todos
- Set priority levels (low, medium, high)
- Filter todos by status (all, active, completed)
- Responsive design for all screen sizes
- Dark/Light mode support
- MongoDB integration for data persistence

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized setup)

## Installation

### Option 1: Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/mandrade86/ToDo.git
   cd ToDo
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

### Option 2: Docker Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Build and start the containers:
   ```bash
   docker-compose up --build
   ```

   This will start:
   - Frontend application (React)
   - Backend API server
   - MongoDB database

3. Access the application:
   - Frontend: http://localhost
   - Backend API: http://localhost:3000
   - MongoDB: mongodb://localhost:27017

## Docker Commands

```bash
# Start all services
docker-compose up

# Start services in detached mode
docker-compose up -d

# View running containers
docker ps

# View logs
docker-compose logs

# Stop all services
docker-compose down

# Stop services and remove volumes
docker-compose down -v

# Rebuild and start services
docker-compose up --build
```

## MongoDB Management

1. **Using MongoDB Compass (GUI)**:
   - Download and install [MongoDB Compass](https://www.mongodb.com/products/compass)
   - Connect using URI: `mongodb://localhost:27017`
   - Database name: `todo`

2. **Using MongoDB Shell**:
   ```bash
   # Access MongoDB shell
   docker exec -it todo_mongodb_1 mongosh
   ```

## Environment Variables

The following environment variables are used in the Docker setup:

- `NODE_ENV`: Set to 'production' in Docker
- `PORT`: Backend server port (default: 3000)
- `MONGODB_URI`: MongoDB connection string (default: mongodb://mongodb:27017/todo)

## Project Structure

```
todo-app/
├── src/                    # Frontend source code
│   ├── components/        # React components
│   ├── services/         # API services
│   └── App.tsx           # Main application component
├── backend/              # Backend source code
├── Dockerfile           # Frontend Docker configuration
├── docker-compose.yml   # Docker services configuration
└── nginx.conf          # Nginx configuration
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
