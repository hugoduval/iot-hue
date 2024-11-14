# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project files
COPY . .

# Build the app
RUN npm run build

# Expose port 3000 to the outside (default port for create-react-app)
EXPOSE 3000

# Start the app using serve to serve the static files
# Install 'serve' to serve the static files
RUN npm install -g serve

# Start the app using the 'serve' command
CMD ["serve", "-s", "build", "-l", "3000"]
