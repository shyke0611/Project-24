#!/bin/bash
set -e

echo "Starting backend..."

cd backend
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
echo "Using Java: $JAVA_HOME"

# Build and run Spring Boot backend
mvn clean install
mvn spring-boot:run &

cd ../embed-service

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Starting embed-service with Uvicorn..."
uvicorn memory_api:app --reload --host 0.0.0.0 --port 8000 &