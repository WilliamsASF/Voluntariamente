#!/bin/bash

echo "🚀 Starting Voluntariamente Development Environment"

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found. Please create it first."
    exit 1
fi

echo "📦 Starting PostgreSQL database..."
docker-compose up -d db

echo "⏳ Waiting for database to be ready..."
sleep 5

echo "🐍 Installing Python dependencies..."
cd backend
pip install -r requirements.txt

echo "🔥 Starting FastAPI server..."
echo "📚 API Documentation will be available at: http://localhost:8000/docs"
echo "🏠 Health check available at: http://localhost:8000/"
echo ""
echo "Press Ctrl+C to stop the server"

uvicorn main:app --reload --host 0.0.0.0 --port 8000
