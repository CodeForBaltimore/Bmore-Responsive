[![Build Status](https://travis-ci.org/CodeForBaltimore/Bmore-Responsive.svg?branch=master)](https://travis-ci.org/CodeForBaltimore/Bmore-Responsive) [![codecov](https://codecov.io/gh/CodeForBaltimore/Bmore-Responsive/branch/master/graph/badge.svg)](https://codecov.io/gh/CodeForBaltimore/Bmore-Responsive)

<!-- TOC -->

- [Bmore Responsive](#bmore-responsive)
    - [Documentation](#documentation)
        - [API Spec](#api-spec)
        - [Database Documentation](#database-documentation)
- [Setup](#setup)
    - [Node and Express setup](#node-and-express-setup)
    - [Environment variables](#environment-variables)
        - [Example .env](#example-env)
    - [PostgreSQL](#postgresql)
        - [Sequelize](#sequelize)
    - [Docker](#docker)
- [Using this product](#using-this-product)
    - [Testing](#testing)
- [Sources and Links](#sources-and-links)
- [Contributors](#contributors)

<!-- /TOC -->

# Bmore Responsive
An API to drive disaster and emergency response systems.

## Documentation
Detailed documents describing this project and its use are available in this repository. The documentation currently available is as follows:
-   [Best Practices](BEST_PRACTICES.md)
-   [Code of Conduct](CODE_OF_CONDUCT.md)
-   [Tech Spec](TECH_SPEC.md)

### API Spec
Our API spec is on Swagger. You can view it here https://app.swaggerhub.com/apis/codeforbaltimore/bmoreResponsive/1.0.0#/ or you can find the `swagger.json` file in our `docs` folder and use it via http://localhost:3000 when the app is running locally.  

### Database Documentation
Our database documentation can be found in our `docs` folder under `database.csv`. This documentation was created using SchemaSpy. Instructions for use can be found here https://github.com/bcgov/schemaspy

# Setup
A `Dockerfile` and `docker-compose` file have been included for convenience, however this may not be the best local setup for this project. For more information on how to use Docker with this project, please see the [docker section](#docker).

To work on this project you should have:
-   NodeJS
-   PostgreSQL (can be in Docker)
-   Docker (optional)
Once you have the prerequisite software installed you can proceed to setup this application.

## Node and Express setup
This application is designed to work as an API driven by Express. To setup your environment first you must install all required dependencies by running the following command from the root of your project directory:
```
npm install
```
Once all dependencies are installed you will need to setup some environment variables to interact with your database and application. 

## Environment variables
You will need to set some local environment variables to run this application. This is true even if you're using Docker.
```
touch .env
echo 'NODE_ENV=local
PORT=<your port>
DATABASE_SCHEMA=<your database schema>
JWT_KEY=<your secret JWT seed phrase or key>
DATABASE_URL=<your connection string based on above variables>
' >> ./.env
```
The `DATABASE_URL` is not a very clear var name, and the string is broken down as `postgres://username:password@host:port/database_name`

An example of the `DATABASE_URL` would be `DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres`

The various variables are defined as follows:
- `NODE_ENV` = The label for your environment. 
- `PORT` = The local port you wish to run on. Defaults to `3000`.
- `DATABASE_URL` = The URL string for your db connection. For example: `postgres://user:pass@example.com:5432/dbname`
- `DATABASE_SCHEMA` = Your local database schema. Postgres default is `public`.
- `JWT_KEY` = A secret value to generate JWT's locally. 
- `SMTP_HOST` = hostname for the SMTP server used to send notification emails
- `SMTP_PORT` = port number for the SMTP server used to send notification emails
- `SMTP_USER` = username for the SMTP server used to send notification emails
- `SMTP_PASSWORD` = password for the SMTP server used to send notification emails
- `BYPASS_LOGIN` = _optional_  Allows you to hit the endpoints locally without having to login. If you wish to bypass the login process during local dev, set this to `true`.

_We do not recommend using the default options for PostgreSQL. The above values are provided as examples. It is more secure to create your own credentials._

**Warning**: If you are running Docker Toolbox instead of Docker Desktop (likely meaning you are running Windows 10 Home, not Professional) you will need to change your `.env` to reflect Docker running on a VM: 
- `DATABASE_HOST`: The IP address Docker is running on. You can find this by running `docker-machine ip` but it's usually `192.168.99.100` instead of `localhost`
- `DATABASE_URL`: This will need to be adjusted as well, for example `DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres` would become `DATABASE_URL=postgres://postgres:postgres@192.168.99.100:5432/postgres`

### Example .env
To make this easier included below is an example `.env` file using all default values. ***We highly recommend*** you use custom values, but this should clarify what is needed for this to run.

```
NODE_ENV=development
PORT=3000
JWT_KEY=test123
DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres
DATABASE_SCHEMA=public
BYPASS_LOGIN=true
```

## PostgreSQL
***You will need a PostgreSQL database running locally to run this application locally.*** You may setup PostgreSQL however you wish, however we recommend using Docker using the instructions found here: https://hub.docker.com/_/postgres

If you are using the Docker method you may spin up your database layer by running this command:
```
docker run -d -e POSTGRES_PASSWORD=<your chosen password> -p 5432:5432 postgres
```

If you're running a database in another way then we trust you can sort it out on your own because you're awesome :sunglasses:

### Sequelize
To properly start the application the database needs to be built by Sequlize ahead of time. To do that run the following commands
1. You must create your database tables without running the application by running `npm run db-create` first.
2. _optional_ You can now seed your database if you wish by running `npm run db-seed`. 

Example `/migrations` and `/seeders` scripts have been supplied. You can rollback your all seeded data at any time by running `npm run db-unseed` and delete all created tables with `npm run db-delete`.

To create new models, migrations, and seeders you _must_ use the Sequelize CLI commands. Full documentation is here https://sequelize.org/master/manual/migrations.html but here are a few useful commands:
- `npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,email:string` - Creates a model under `/src/models` and a migration script.
- `npx sequelize-cli seed:generate --name demo-user` - Creates a seeder for the `User` model and migration previously setup.

## Docker
To use the `docker-compose.yml` file included you will first need to set [environment variables](#environment-variables). You **MUST** set your `DATABASE_HOST` to `db` to use the `docker-compose` solution. 

If you are running your own database, but want to use the `Dockerfile` you will need to run that this way:
```
docker build -t bmoreres .
docker run -d -p 3000:3000 --env-file=.env bmoreres
```
Note that `DATABASE_URL` host location will be different depending on what OS you're using. On Mac it is `docker.for.mac.host.internal` and on Windows it is `docker.for.win.host.internal` if using `docker-compose` it will be `db`

You can manually set the environment variables and not use a `.env` file by setting the following vars:
```
-e NODE_ENV=development
-e PORT=3000 
-e JWT_KEY=<your JWT phrase>
-e DATABASE_URL=<your connection string>
-e DATABASE_DATABASE_SCHEMA=<your database schema>
```

# Using this product
You may use this product to create and manage users for your front-end. More to come! 
To run the application--after the above steps are completed--run `npm start`.

## Testing
To test your code you may write test cases to `./index.spec.js` and then run the tests with `npm test`.

To check your linting you may run `npm run lint` and to format and automatically fix your formatting run `npm run format`.

# Sources and Links
We are also building a front-end application called [Healthcare Rollcall](https://github.com/CodeForBaltimore/Healthcare-Rollcall) to interact with this backend API. To view that project, or to contribute to it, please visit the repo here: https://github.com/CodeForBaltimore/Healthcare-Rollcall

We will be including multi-repo build processes with the front-end that will reference this project.

# Contributors
A ***BIG THANK YOU*** to all of our contributors and helpers! This project could not work without the contributions of the volunteers. THANK YOU!!!!

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-13-orange.svg?style=flat-square)](#contributors)
<!-- ALL-CONTRIBUTORS-BADGE:END --> 

<p align="center">
    <img src="docs/img/CfB.png" width="400">
</p>

