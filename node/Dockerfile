# create a file named Dockerfile
FROM yingray/node-phantom:latest
RUN mkdir /app
WORKDIR /app
COPY . /app
RUN yarn
EXPOSE 8080
CMD ["npm", "start"]