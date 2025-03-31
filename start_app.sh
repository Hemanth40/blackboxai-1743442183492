#!/bin/bash
# Stop any existing servers
pkill -f "node server.js" || true

# Start consolidated server
cd gambling-calculator
node server.js &

echo "Server started successfully"
echo "Access at: http://localhost:8000"
echo "Available routes:"
echo "- /calculator"
echo "- /quiz"
echo "- /stories"
