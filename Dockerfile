# Use the official Node.js image
FROM node:22-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application files
COPY . ./

# Expose the port Vite uses in development
EXPOSE 5173

# Run Vite in development mode
CMD ["npm", "run", "dev"]
