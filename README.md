[![Build Status](https://travis-ci.org/CodeForBaltimore/Bmore-Responsive.svg?branch=master)](https://travis-ci.org/CodeForBaltimore/Bmore-Responsive) [![codecov](https://codecov.io/gh/CodeForBaltimore/Bmore-Responsive/branch/master/graph/badge.svg)](https://codecov.io/gh/CodeForBaltimore/Bmore-Responsive) [![Greenkeeper badge](https://badges.greenkeeper.io/CodeForBaltimore/Bmore-Responsive.svg)](https://greenkeeper.io/)

# Bmore Responsive
An API to drive disaster and emergency response systems.

## Documentation
We've included a `docs` folder with a template [Tech Spec](/docs/Tech_Spec.md) and [Best Practices](/docs/Best_Practices.md) document, though using Github's Wiki capabilities is also a good idea. This will get you started with documenting your project.  Other documents and relevant information that has no other place can live in the `docs` folder.  Replace this paragraph with a brief breakdown of what you've included in your `docs` folder.

## Setup
A `Dockerfile` and `docker-compose` file have been included for convenience, however this may not be the best local setup for this project. To work on this project you should have:
-   NodeJS
-   PostgreSQL (can be in Docker)
-   Docker (optional)
Once you have the prerequisite software installed you can proceed to setup this application.

### PostgreSQL
You will need a PostgreSQL database running locally to run this application locally. You may setup PostgreSQL however you wish, however we recommend using Docker using the instructions found here: https://hub.docker.com/_/postgres

If you are using the Docker method you may spin up your database layer by running this command:
```
docker run -d -p 5432:5432 postgres
```
If you're running a database in another way then we trust you can sort it out on your own because you're awesome :sunglasses:

### Node and Express setup
This application is designed to work as an API driven by Express. To setup your environment first you must install all required dependencies by running the following command from the root of your project directory:
```
npm install
```
Once all dependencies are installed you will need to setup some environment variables to interact with your database and application. To do that you may run:
```
touch .env
echo 'NODE_ENV=local
PORT=<your port>
ERASE_DATABASE=true
DATABASE=<your database name>
DATABASE_USER=<your database user>
DATABASE_PASSWORD=<your database password>
DATABASE_SCHEMA=<your database schema>
SEED_DATA_PASSWORD=<a password for your seed user(s)>
JWT_KEY=<your secret JWT seed phrase or key>
' >> ./.env
```

The various variables are defined:
- `PORT` = The local port you wish to run on. Defaults to `3000`.
- `ERASE_DATABASE`= _optional_  Do you wish to drop your entire db each time you restart the app? If so, set this flag to `true`. _You should only use this or `SEED_DATABASE` but not both_
- `SEED_DATABASE` = _optional_  Run the seeding script without dropping the existing values in the database. To use, set to `true`. _You should only use this or `ERASE_DATABASE` but not both_
- `DATABASE` = Your database name. Postgres default is `postgres`.
- `DATABASE_USER` = Your local database login username. Postgres default is `postgres`.
- `DATABASE_PASSWORD` = Your local database login password. Postgres default is `postgres`.
- `DATABASE_SCHEMA` = Your local database schema. Postgres default is `public`.
- `SEED_DATA_PASSWORD` = A password for your seed user(s).
- `JWT_KEY` = A secret value to generate JWT's locally. 
- `BYPASS_LOGIN` = _optional_  Allows you to hit the endpoints locally without having to login. If you wish to bypass the login process during local dev, set this to `true`.

_We do not recommend using the default options for PostgreSQL. The above values are provided as examples. It is more secure to create your own credentials._

## Using this product
You may use this product to create and manage users for your front-end. More to come! 
To run the application--after the above steps are completed--run `npm start`.

## Testing
To test your code you may write test cases to `./index.spec.js` and then run the tests with `npm test`.

To check your linting you may run `npm run lint` and to format and automatically fix your formatting run `npm run format`.

## Sources and Links
We are also building a front-end application called [Healthcare Rollcall](https://github.com/CodeForBaltimore/Healthcare-Rollcall) to interact with this backend API. To view that project, or to contribute to it, please visit the repo here: https://github.com/CodeForBaltimore/Healthcare-Rollcall

We will be including multi-repo build processes with the front-end that will reference this project.

<p align="center">
    <img src="docs/img/CfB.png" width="400">
</p>

