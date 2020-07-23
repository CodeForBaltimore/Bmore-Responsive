Once you've installed the


## API Spec
The Bmore Responsive API is documented via a OAS 3.0 API specification in the file `swagger.json`. This API spec lists all the endpoints, supported REST actions, and the request and response data formats. While you can open the `swagger.json` file in any text editor, there are better ways to view it in a richer format, such as:

- View the [API Spec on Swaggerhub](https://app.swaggerhub.com/apis/codeforbaltimore/bmoreResponsive)
- If you are running Bmore Responsive, then you can just point your browser at the root URL of your server, often `http://localhost:3000/`, you'll be redirected to `http://localhost:3000/api-docs/`

## Postman Collection

For a library of sample API calls, please refer to the Postman collection `Bmore-Responsive.postman_collection.json`. Need Postman? Click [here](https://www.postman.com/downloads/).

<TODO: Add explanation of folder structure, tests, token mgmt and dependencies, environments/variables>

## Authentication

The Bmore Responsive API provides security by limiting use of nearly all features to authenticated users. If you have NOT disabled login, you'll need to pass a [JSON Web Token (JWT)](https://jwt.io/) with every call to a secured endpoint. Only the login (`/user/login`) and health (`/health`) endpoints are unsecured. To get a JWT, you'll need to pass a valid username and password to `/user/login`; the encoded JWT is the response body. This JWT should be passed as the `Authorization` header using the `Bearer` [authentication scheme](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication). This token will expire after a short period of time. If it expires, you can get a new token by making another call to `user/login`.

_Note: If you have used the db-seed script, you'll already have a user account created that will enable you to login.  This default login is username `homer.simpson@sfpp.com` and password `donuts`._

<TODO: Add subsections to describe common tasks like adding user, adding role, setting/changing access, adding entity, relating contact to entity, etc...>

## Seed and re-seed the database

This repo has four scripts that simplifies the creation and loading of the database.   These script commands are as follows:

- `npm run db-create` will create the database and run all migrations.
- `npm run db-delete` will delete all tables and revert all migrations.
- `npm run db-seed` will run all seeders and populate database with random, Simpsons-like data.
- `npm run db-unseed` will delete all data in all tables and revert all seeders.
