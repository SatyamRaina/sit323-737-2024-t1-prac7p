# Use official Node.js LTS image
FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json if available (optional for Hello World)
# COPY package*.json ./
# RUN npm install

# Copy source code
COPY . .

# Install express if not already installed
RUN npm install express

# Expose the port the app runs on
EXPOSE 3051

# Command to run the app
CMD ["node", "test.js"]
