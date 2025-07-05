#!/bin/bash
set -e

echo "Starting backend..."

cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
echo "Using Java: $JAVA_HOME"

# Build and run Spring Boot backend
mvn clean install
mvn spring-boot:run &
BACKEND_PID=$!

cd ../embed-service

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Starting embed-service with Uvicorn..."
uvicorn memory_api:app --reload --host 0.0.0.0 --port 8000 &
EMBED_PID=$!

# Trap Ctrl+C (SIGINT) and kill both processes
trap "echo 'Stopping services...'; kill $BACKEND_PID $EMBED_PID; exit" SIGINT

# Wait for both to finish (will exit on Ctrl+C)
wait