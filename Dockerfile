# Build from Node Alpine image
FROM node:12.11.0-alpine

# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Environment variables
ENV NODE_ENV production
ENV PORT 3000

# Install app dependencies
COPY ./package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port (will not be respected by Heroku, must be defined in app)
EXPOSE 3000

# Run app
CMD ["npm", "start"]
