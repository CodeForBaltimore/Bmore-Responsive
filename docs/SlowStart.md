If you want to tweak the installation of Bmore Responsive or have a different environment, then this page will provide additional detail on how to install/configure Bmore Responsive.

## Configuring via Environment variables
Regardless of where you are running the system, environment variables to run this application.  These variables are set in the `.env` file on the root directory of Bmore Responsive.

The various variables are defined as follows:

- `NODE_ENV` = The label for your environment. It can be anything you want and will allow you to differentiate multiple instances.
- `PORT` = The local port you wish to run on. Defaults to `3000`.
- `DATABASE_URL` = The URL string for your db connection. For example: `postgres://username:password@host:port/dbname` where `host` can be specified as a (sub)domain or IP address.
- `DATABASE_SCHEMA` = Your local database schema. Postgres default is `public`.
- `JWT_KEY` = A secret value to generate JSON Web Tokens (JWTs) locally.
- `SMTP_HOST` = _optional_ hostname for the SMTP server used to send notification emails
- `SMTP_PORT` = _optional_ port number for the SMTP server used to send notification emails
- `SMTP_USER` = _optional_ username for the SMTP server used to send notification emails
- `SMTP_PASSWORD` = _optional_ password for the SMTP server used to send notification emails
- `BYPASS_LOGIN` = _optional_  Allows you to hit the endpoints locally without having to login. If you wish to bypass the login process during local dev, set this to `true`.  _Note: at the moment, login will be bypassed if this variable simply exists in the `.env` file.  Even `BYPASS_LOGIN = false` will remove the need to login.  To require login, simply remove mention of this variable from this file._

_We do not recommend using the default options for PostgreSQL. The above values are provided as examples. It is more secure to create your own credentials._

## Deploying to AWS

If you want to deploy to AWS, we have included a `terraform` option. For more information on how to use this feature, please see the [Terraform README](../terraform/README.md).  <TODO: Fix this link or move content from README to here>

## Running in Docker 

Here's how to run Bmore Responsive within a Docker container. <TODO: This sections needs some attention>

**Warning**: If you are running Docker Toolbox instead of Docker Desktop (likely meaning you are running Windows 10 Home, not Professional) you will need to change your `.env` to reflect Docker running on a VM:

- `DATABASE_HOST`: The IP address Docker is running on. You can find this by running `docker-machine ip` but it's usually `192.168.99.100` instead of `localhost`
- `DATABASE_URL`: This will need to be adjusted as well, for example `DATABASE_URL=postgres://postgres:postgres@localhost:5432/postgres` would become `DATABASE_URL=postgres://postgres:postgres@192.168.99.100:5432/postgres`
