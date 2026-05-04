FROM node:20

WORKDIR /app

# 1. Copy ONLY the manifest files first
COPY package*.json ./

# 2. Install ALL dependencies (including axios and express)
RUN npm install

# 3. Copy the rest of the code (app.js, tests/, public/, etc.)
COPY . .

# 4. Default command to start the game
CMD ["node", "app.js"]