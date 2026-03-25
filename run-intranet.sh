#!/bin/bash

# Get the first local IP address
IP=$(hostname -I | awk '{print $1}')

echo "----------------------------------------------------"
echo "⚡ Intelli Power Monitor - Intranet Mode"
echo "🌐 Local IP: $IP"
echo "----------------------------------------------------"

# 0. Start Docker services
echo "🐳 Starting Docker services..."
docker compose up -d

# 1. Seed/Refresh Data
echo "📦 Refreshing sample data..."
cd backend && node seed.js && cd ..

# 2. Start Backend
echo "🚀 Starting Backend on port 5000..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# 3. Start Frontend
echo "💻 Starting Frontend on $IP:5173..."
cd frontend
VITE_API_BASE_URL="http://$IP:5000/api" npm run dev -- --host &
FRONTEND_PID=$!
cd ..

# Cleanup: stop everything on exit
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; docker compose down" EXIT

# Wait so script doesn't exit immediately
wait