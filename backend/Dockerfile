# Dockerfile for SwasthAI Backend (Flask API)
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY backend.py .
COPY .env* ./

# Expose port
EXPOSE 5000

# Set environment variables
ENV FLASK_APP=backend.py
ENV FLASK_ENV=production

# Run the application
CMD ["python", "backend.py"]
