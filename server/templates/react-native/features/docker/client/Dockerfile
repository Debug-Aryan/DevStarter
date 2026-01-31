# Start from a Node.js image to run Expo CLI
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose Metro Bundler port
EXPOSE 8081

# Start Expo
CMD ["npx", "expo", "start", "--host", "lan"]
