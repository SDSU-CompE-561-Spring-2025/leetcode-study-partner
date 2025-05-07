FROM node:18-slim

# Install required build tools
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies and force rebuild
COPY package*.json ./
RUN npm install
RUN npm rebuild lightningcss

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]