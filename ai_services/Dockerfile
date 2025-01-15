FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create models directory
RUN mkdir -p models

# Copy the entire src directory
COPY src/ ./src/
COPY requirements.txt .

# Install dependencies
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV PYTHONPATH=/app
ENV MODEL_PATH=/app/models

# Expose port
EXPOSE 8000

# Run the application
CMD ["python", "src/deidentification_service.py"] 