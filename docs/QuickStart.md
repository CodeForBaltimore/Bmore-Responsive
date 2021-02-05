# Quick Start

This brief guide will get you up and running your own copy of Bmore Responsive with sample data so you can get familiar with the solution by using it directly. The approach below is just one way to get Bmore Responsive running. For other approaches and more detail on configuration, please see the [Slow Start Guide](SlowStart.md) section of the Users' Guide.

## Step 0 - Download code from github

We're assuming that you've cloned or downloaded the contents of the [Bmore Responsive repository on GitHub](https://github.com/CodeForBaltimore/Bmore-Responsive).

## Step 1 - Install Required Software

In order to follow this quick start guide you'll need to make sure you have the following software installed on your machine:

- **Docker Desktop with DockerHub access** - Docker is not technically required to run BMore Responsive, but this guide uses Docker to get up and running quickly. You can confirm that you have Docker Desktop by executing `docker -v` at a command line. If your machine replies with a version number like `Docker version 19.03.8, build afaca4b` then you have Docker Desktop installed. If you need to install Docker Desktop, head on over to the [Docker Desktop page](https://www.docker.com/products/docker-desktop).

## Step 2 - Configure Your Environment

Add the following to a file named `.env` in your project directory:

```conf
DATABASE_PASSWORD= # Custom value
JWT_KEY= # Custom value
```

- `DATABASE_PASSWORD`: The password used to authenticate to the postgres database. For security, use a custom value.
- `JWT_KEY`: A secret value to generate JSON Web Tokens (JWTs) locally. For security, use a custom value.

## Step 4 - Run Development Stack

To run the application run `docker-compose up -d --build`.

## Step 5 - Confirm Success

To confirm the server is running, just point your browser to [http://localhost:3001/entity](http://localhost:3001/entity). A response like the sample below lets you know your server is healthy.

```json
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
    }
  ]
}
```

**Congratulations!** Why not check out the ["How to Use"](HowToUse.md) guide and learn more by using Bmore Responsive. When done, you can shut everything down with `docker-compose down`.
