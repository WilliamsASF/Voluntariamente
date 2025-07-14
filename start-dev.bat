@echo off
echo 🚀 Starting Voluntariamente Development Environment

if not exist ".env" (
    echo ❌ .env file not found. Please create it first.
    pause
    exit /b 1
)

echo 📦 Starting PostgreSQL database...
docker-compose up -d db

echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak > nul

echo 🐍 Installing Python dependencies...
cd backend
pip install -r requirements.txt

echo 🔥 Starting FastAPI server...
echo 📚 API Documentation will be available at: http://localhost:8000/docs
echo 🏠 Health check available at: http://localhost:8000/
echo.
echo Press Ctrl+C to stop the server

uvicorn main:app --reload --host 0.0.0.0 --port 8000
