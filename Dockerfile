FROM node:10-alpine

COPY . /src
WORKDIR /src
RUN apk add --no-cache openldap python make &&\
    npm install &&\
    npm run build
CMD ["npm", "start"]