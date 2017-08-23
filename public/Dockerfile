FROM node:alpine

COPY . /app
WORKDIR /app

RUN npm install -g yarn
RUN yarn

EXPOSE 8081

CMD ["npm", "start"]
