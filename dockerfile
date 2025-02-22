FROM node:22.14.0

WORKDIR /

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

EXPOSE 3000

CMD ["node", "neo4j-api.js"]
