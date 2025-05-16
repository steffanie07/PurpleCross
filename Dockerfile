# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy files and install
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port and run
EXPOSE 5173
CMD ["npm", "run", "dev"]
