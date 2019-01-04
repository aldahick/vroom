FROM node:10
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm i

EXPOSE 8080
CMD [ "node", "dist/app" ]
