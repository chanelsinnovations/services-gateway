# syntax=docker/dockerfile:1

# Use the official Node.js 18 image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the .env file into the container (if needed)
COPY .env .

# Copy package.json and package-lock.json files into the container
COPY package*.json ./


# Install production dependencies
RUN npm install --production

# Copy the rest of the application source code into the container
COPY . .

# Expose port 80 to the outside world
EXPOSE 8083

# Command to run the application
CMD ["node", "app.js"]
