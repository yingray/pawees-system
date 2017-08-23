# create a file named Dockerfile
FROM yingray/node-phantom:latest

VOLUME . /app
WORKDIR /app
RUN yarn
EXPOSE 8080

CMD ["npm", "start"]
