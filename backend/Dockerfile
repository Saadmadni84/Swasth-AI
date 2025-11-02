# Use lightweight Python image
FROM python:3.11-slim

# System dependencies (for OCR, audio, etc.)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    tesseract-ocr \
    libtesseract-dev \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Working directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all project files
COPY . .

# Expose Flask port (using 5001 to avoid macOS AirPlay conflict)
EXPOSE 5001

# Environment variables
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1

# Run the Flask app
CMD ["python", "app.py"]
