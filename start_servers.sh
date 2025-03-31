#!/bin/bash
# Kill any existing processes
pkill -f "node server.js" || true

# Start Calculator on port 8000
cd gambling-calculator
node server.js &

# Start Quiz on port 8001
cd ../gambling-quiz
node server.js &

echo "Both servers started successfully"
echo "Calculator: http://localhost:8000"
echo "Quiz: http://localhost:8001"