# Use the official Python image as a base image
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project files into the container
COPY . .

# Run migrations and start the server
CMD ["bash", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
