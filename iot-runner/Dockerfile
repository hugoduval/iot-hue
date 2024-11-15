# Use a base Python image
FROM python:3.15-slim

# Set the working directory
WORKDIR /app

# Copy the Python script and requirements file to the container
COPY main.py .
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set the default command to run the Python script
CMD ["python", "main.py"]
