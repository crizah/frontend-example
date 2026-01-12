
FROM node:18.19.1

WORKDIR /app


COPY package.json ./
COPY package-lock.json ./
COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 3000

CMD ["npm", "start"]
