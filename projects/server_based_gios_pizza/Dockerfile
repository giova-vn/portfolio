#base image
FROM node:alpine

#working directory
WORKDIR /usr/src/app

#install dependecy to be abble to build sqlite
RUN apk add --no-cache python3 make g++

#anything that its going to use
COPY package*.json ./
RUN npm install

#copying code
COPY . .

#exposing
EXPOSE 3000
CMD ["node", "app.js"]