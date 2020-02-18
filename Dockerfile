# Build from Node Alpine image
FROM node:12.11.0-alpine

# Create app directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# Arguments
ARG node_env=development
ARG port=3000
ARG database=postgres
ARG database_user=postgres
ARG database_password=postgres
ARG database_schema=public
ARG jwt_key=abc_123

# Environment variables
ENV NODE_ENV $node_env
ENV PORT $port
ENV DATABASE $database
ENV DATABASE_USER $database_user
ENV DATABASE_PASSWORD $database_password
ENV DATABASE_SCHEMA $database_schema
ENV JWT_KEY $jwt_key

# Install app dependencies
COPY ./package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Expose port (will not be respected by Heroku, must be defined in app)
EXPOSE $port

# Run app
CMD ["sh","./scripts/dockerrun.sh"]
