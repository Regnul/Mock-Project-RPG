FROM node:20

WORKDIR /app

# Copy package manifests first to leverage build caching
COPY package*.json ./

# Install all required production and development dependencies
RUN npm install

# Copy the remaining application source code
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]