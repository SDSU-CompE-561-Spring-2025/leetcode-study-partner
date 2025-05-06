FROM node:18-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install  # Postinstall runs: npm rebuild lightningcss

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]