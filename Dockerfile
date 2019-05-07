FROM node:12.1.0-alpine

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install

RUN apk add python

# Bundle app source
COPY . /usr/src/app

# Install app dependencies
RUN npm install

# Run
CMD [ "npm", "start" ]
