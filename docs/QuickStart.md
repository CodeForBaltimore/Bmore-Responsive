# Quick Start

This brief guide will get you up and running your own copy of Bmore Responsive with sample data so you can get familiar with the solution by using it directly. The approach below is just one way to get Bmore Responsive running.  For other approaches and more detail on configuration, please see the [Slow Start Guide](SlowStart.md) section of the Users' Guide.


## Step 0 - Download code from github
We're assuming that you've cloned or downloaded the contents of the [Bmore Responsive repository on GitHub](https://github.com/CodeForBaltimore/Bmore-Responsive).

## Step 1 - Install Required Software
In order to follow this quick start guide you'll need to make sure you have the following software installed on your machine:

- **Node.js** - You can confirm you have Node.js by executing `node -v` at a command line.  If your machine replies with a version number like `13.8.0` then you have Node.js installed.  If you need to install Node.js, head on over to [Nodejs.org](https://nodejs.org/).
- **Docker Desktop with DockerHub access** - Docker is not technically required to run BMore Responsive, but this guide uses Docker to get up and running quickly. You can confirm that you have Docker Desktop by executing `docker -v` at a command line.  If your machine replies with a version number like `Docker version 19.03.8, build afaca4b` then you have Docker Desktop installed. If you need to install Docker Desktop, head on over to the [Docker Desktop page](https://www.docker.com/products/docker-desktop).

## Step 2 - Install

Open your terminal, change to your Bmore-Responsive directory (created in Step 0) then run `npm install`

## Step 3 - Configure Your Environment

You'll need to create a text file named `.env` in your Bmore-Responsive directory.  This file set initial values of your environment variables.

```
NODE_ENV=development
PORT=3000
JWT_KEY=test123
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
DATABASE_SCHEMA=public
BYPASS_LOGIN=true
```

*Note: The DATABASE_URL above asserts that your username and password for your DB are both `postgres` as the URL format is generally `postgres://user:pass@example.com:5432/dbname`.*  _We highly recommend_ *changing these values in this step and the following step.*

## Step 4 - Start Up a Database

Use Docker to start up a PostgreSQL database with the following command:
```
docker run -d -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres
```
*Note: If you changed your username or password in the previous step, you'll need to replace values in this command to match.*

## Step 5 - Create and Seed Database

In order to create the necessary database tables run `npm run db-create`.

To populate the DB with sample users, entities and contacts that may resemble the fictional world of *The Simpsons* just run `npm run db-seed`.

## Step 6 - Run Server

To run the application run `npm start`.  Your terminal output should end with a line like `Bmore Responsive is available at http://localhost:5000`

## Step 7 - Confirm Success

To confirm the server is running, just point your browser to [http://localhost:5000/entity](http://localhost:5000/entity) (or just add "/entity" to the URL from the previous step).  A response like the sample below lets you know your server is healthy.

```
{
  "_meta": {
    "total": 25
  },
  "results": [
    {
      "id": "376fb5a1-d8fe-42ce-9492-cca41148ff1a",
      "name": "The Leftorium",
      "type": "Test",
      "address": {
      "street": [
      "123 Anyplace St."
      ],     

      ...
```

**Congratulations!** Why not check out the ["How to Use"](HowToUse.md) guide and learn more by using Bmore Responsive.
