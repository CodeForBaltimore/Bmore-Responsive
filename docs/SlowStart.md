# Slow Start

If you want to tweak the installation of Bmore Responsive or have a different environment, then this page will provide additional detail on how to install/configure Bmore Responsive.

## Configuring via Environment variables

Regardless of where you are running the system, environment variables to run this application. These variables are set in the `.env` file on the root directory of Bmore Responsive.

### Environment Variables

- `NODE_ENV`: The label for your environment. It can be anything you want and will allow you to differentiate multiple instances. Default: `development`.
- `PORT`: The local port you wish to run on. Default: `3001`.
- `DATABASE_HOST`: The database host PostgreSQL is running on, which can be specified as a (sub)domain or IP address. Default: `db` (for `docker-compose` Postgres instance).
- `DATABASE_PORT`: The database port PostgreSQL is running on. Default: `5432`.
- `DATABASE_NAME`: The name of the PostgreSQL database to connect to. Default: `postgres`.
- `DATABASE_SCHEMA`: Your local database schema. Default: `public`.
- `DATABASE_USERNAME`: The username for connecting to PostgreSQL. Default: `postgres`.
- `DATABASE_PASSWORD`: The password for connecting to PostgreSQL.
- `JWT_KEY`: A secret value to generate JSON Web Tokens (JWTs) locally.
- `SMTP_HOST`: _optional_ Hostname for the SMTP server used to send notification emails
- `SMTP_PORT`: _optional_ Port number for the SMTP server used to send notification emails
- `SMTP_USER`: _optional_ Username for the SMTP server used to send notification emails
- `SMTP_PASSWORD`: _optional_ Password for the SMTP server used to send notification emails
- `BYPASS_LOGIN`: _optional_ Allows you to hit the endpoints locally without having to login. If you wish to bypass the login process during local dev, set this to `true`. Default: `true`. _Note: at the moment, login will be bypassed if this variable simply exists in the `.env` file. Even `BYPASS_LOGIN = false` will remove the need to login. To require login, simply remove mention of this variable from this file._

_We do not recommend using the default options for PostgreSQL. The above values are provided as examples. It is more secure to create your own credentials._

## Deploying to AWS

If you want to deploy to AWS, we have included a `terraform` option. For more information on how to use this feature, please see the README in `/terraform`.

<TODO: Consider migrating terraform docs to be here or do some sort of INCLUDE to reuse the content>

## SMTP

To send emails with the system you will need to setup your SMTP sever and set the relevant `SMTP_*` variables. For testing we recommend using [Ethereal](https://ethereal.email/)

## Running in Docker

You can build and run the application in Docker locally by running the following commands:

```shell
docker-compose up -d
```

### docker-compose

To use the `docker-compose.yml` file included you will first need to set [environment variables](#environment-variables). It is not recommended to use `docker-compose` for any reason other than to test a solution for a separate front-end component.

## Running within Gitpod

You can build and run the application utilizing Gitpod if desired. You must have a Gitpod account, you can sign up for one here if desired: [Gitpod](https://gitpod.io/). If desired, you can also install a browser extension to make creating your "pods" easier [here](https://www.gitpod.io/docs/browser-extension/). Once you have created a Gitpod account and installed the extension, you can simply navigate to the [Bmore Responsive Github repository](https://github.com/CodeForBaltimore/Bmore-Responsive) and you will see a Gitpod button located at the top of the repo. Clicking on that button should open a Gitpod instance with a running Postgres Database. Once the pod has started, you will be able to run the commands needed to create and seed the Database and run the application. If you haven't installed the extension, then you can create a workspace by prefixing any GitHub URL with gitpod.io/#. For Bmore that would look like https://gitpod.io/#github.com/CodeForBaltimore/Bmore-Responsive
