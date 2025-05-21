#!/bin/bash

echo "Starting Simple Notes App Server..."

# Function to check if a port is in use
is_port_in_use() {
  if nc -z 127.0.0.1 "$1" &>/dev/null || ss -tuln | grep -q ":$1 "; then
    return 0 # Port is in use
  else
    return 1 # Port is not in use
  fi
}

PORT=9000

if is_port_in_use $PORT; then
  echo "Error: Port $PORT is already in use. Please free the port or choose a different one."
  exit 1
fi

# Check if Python 3 is installed
if command -v python3 &>/dev/null; then
    echo "Python 3 found. Starting server on http://localhost:$PORT"
    # Serve the current directory
    python3 -m http.server $PORT
elif command -v python &>/dev/null; then
    echo "Python 2 found. Starting server on http://localhost:$PORT"
    # Serve the current directory. Note: SimpleHTTPServer is for Python 2.
    python -m SimpleHTTPServer $PORT
else
    echo "Error: Python is not installed. Please install Python (version 2 or 3) to run the server."
    echo "For example, on Debian/Ubuntu: sudo apt update && sudo apt install python3"
    echo "Or download from python.org"
    exit 1
fi