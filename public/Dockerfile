FROM node:alpine

VOLUME . /app
WORKDIR /app

RUN npm install -g yarn
RUN yarn

EXPOSE 8081

CMD ["npm", "start"]
