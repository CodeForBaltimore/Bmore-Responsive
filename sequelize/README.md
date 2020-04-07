# Sequelize
This directory contains scripts and config options to seed the database with dummy data. For information and documentation about Sequelize please see their official website https://sequelize.org/

## Migrations
Migrations are the scripts to create tables and initialize the database. Migrations can be written to run after the initial migration takes place.

It is important to note that the migrations run in sequential order, so using a numbering system is important. It is also important to note that FK columns and relationships can be ***and should be*** defined as their own migrations. This is to prevent errors of columns being created when the parent table no longer exists. 

Individual migrations _can_ be reverted as per the Sequelize documentation.

## Seeders
A seeder is a script to seed a particular set of data. As with Migrations these scripts run in order, so numbering is important.

Because of FK constraints it is again important to note when data is seeded to prevent errors with FK constraints. Imports can be chained in a single seed script, and this may be useful and advised for seeded data that is related through a FK.

## NPM commands
This repo has simplified a few of the Sequelize CLI options that would be commonly used by this project.
- `npm run db-create` will create the database and run all migrations.
- `npm run db-delete` will delete all tables and revert all migrations.
- `npm run db-seed` will run all seeders and populate all data.
- `npm run db-unseed` will delete all data in all tables and revert all seeders.