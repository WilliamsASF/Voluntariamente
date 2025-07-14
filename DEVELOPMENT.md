# Voluntariamente - Development Guide

## Quick Start

### 1. Environment Setup
```bash
# Navigate to project root
cd Voluntariamente

# Copy environment file (already created)
# Edit .env file with your database credentials

# Start database
docker-compose up -d db

# Install Python dependencies
cd backend
pip install -r requirements.txt
```

### 2. Run the Backend
```bash
# From backend directory
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Access the API
- API Documentation: http://localhost:8000/docs
- Alternative docs: http://localhost:8000/redoc
- Health check: http://localhost:8000/

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/token` - Login (get JWT token)
- `GET /auth/me` - Get current user info

### Users
- `GET /users/` - List all users
- `GET /users/{id}` - Get specific user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

### Students (Estudantes)
- `GET /estudantes/` - List all students
- `GET /estudantes/{id}` - Get specific student
- `POST /estudantes/` - Create student profile
- `PUT /estudantes/{id}` - Update student
- `DELETE /estudantes/{id}` - Delete student
- `GET /estudantes/me/projetos` - Get my projects

### Professors
- `GET /professores/` - List all professors
- `GET /professores/{id}` - Get specific professor
- `POST /professores/` - Create professor profile
- `PUT /professores/{id}` - Update professor

### ONGs
- `GET /ongs/` - List all ONGs
- `GET /ongs/{id}` - Get specific ONG
- `POST /ongs/` - Create ONG (Admin only)
- `PUT /ongs/{id}` - Update ONG (Admin only)

### Projects & Tasks
- `GET /projetos/` - List projects
- `GET /tasks/` - List tasks
- `POST /matriculas/` - Enroll student in project
- `POST /task-estudantes/` - Assign task to student

## User Roles
- `Estudante` - Students who contribute to projects
- `Professor` - Professors who guide students
- `Admin` - System administrators

## Development Workflow

### 1. Database Changes
- Modify `01-schema.sql` for schema changes
- Update `models.py` to match schema
- Update `schemas.py` for API models
- Restart database: `docker-compose down -v && docker-compose up -d`

### 2. API Development
- Add new endpoints in appropriate router files
- Follow the existing pattern in `/routers/` directory
- Include proper authentication and authorization
- Add input validation using Pydantic schemas

### 3. Testing
```bash
# Run the API and test with curl or Postman
curl -X POST "http://localhost:8000/auth/register" \
     -H "Content-Type: application/json" \
     -d '{"username": "test", "email": "test@example.com", "password": "password", "role": "Estudante"}'
```

## Next Development Priorities

1. **Frontend Development**
   - Create React/Vue.js frontend
   - Implement user registration/login
   - Create dashboards for each user type

2. **Enhanced Features**
   - Email notifications
   - File upload for project documents
   - Progress tracking
   - Reporting system

3. **Security**
   - Password reset functionality
   - Email verification
   - Rate limiting
   - Input sanitization

4. **Testing**
   - Unit tests
   - Integration tests
   - API endpoint testing
