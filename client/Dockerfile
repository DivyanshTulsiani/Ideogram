# Will be using node 22 with alpine as our base image
FROM node:22-alpine

# Set our workdir which is after this
WORKDIR /app

# copy all our neccesary packages
COPY package*.json ./

#install dependencies
RUN npm install

#copy all project files
COPY . .


# Expose on a port
EXPOSE 5177

# command to run
CMD ["npm","run","dev"]