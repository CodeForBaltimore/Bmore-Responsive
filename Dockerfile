# Build from Node Alpine image
FROM node:12.11.0-alpine
ARG PORT=3001
ENV PORT=$PORT

# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Install app dependencies
COPY ./package*.json ./
RUN npm install --loglevel warn

# Bundle app source
COPY . .

# Expose port (will not be respected by Heroku, must be defined in app)
EXPOSE $PORT

# Run app
CMD ["npm","start"]
