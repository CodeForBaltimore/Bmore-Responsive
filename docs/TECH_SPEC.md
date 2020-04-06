<!-- TOC -->

- [Tech Spec](#tech-spec)
    - [Overview](#overview)
    - [Scenarios](#scenarios)
        - [COVID-19](#covid-19)
        - [Automatic Checkin](#automatic-checkin)
        - [Organized Response](#organized-response)
    - [Non Goals](#non-goals)
    - [Minimum Viable Product](#minimum-viable-product)
    - [Components](#components)
        - [API](#api)
        - [CI/CD](#cicd)
        - [Data](#data)
        - [Application Architecture](#application-architecture)
    - [Roadmap](#roadmap)
    - [Contact Info](#contact-info)

<!-- /TOC -->

# Tech Spec
Bmore Responsive is a Contact and Response Management System (CRMS) and API. This document will describe the application in some detail.

## Overview
This application will allow users to add and update contact information for individuals and entities. Additionally, the system will facilitate tracking of entity status and any other pertinent information. The data collected can be used by municipalities to organize response efforts in a disaster or crisis situation.

## Scenarios
This application and API can be used in a few different ways.

### COVID-19
During the COVID-19 Pandemic the City of Baltimore needs a way to check-in with healthcare providers to ensure they have all of the supplies they need, if they have any patients sick with the virus, if anyone is in quarantine, etc. 

Many healthcare facilities have a few members on staff, however the contact information for those individuals may be out of date or the facility may have experienced some changeover since the last checkin.

Using the API and a front-end, the City of Baltimore would be able to keep track of the facility's status via multipule contact points in an organized and efficient way.

### Automatic Checkin
Facilities may not have time for phone calls, and the number of available city workers may not be sufficient to check in with all providers during an emergency. 

Using our API the providers can securely check-in using a web form on their own. One-time use logins can be sent on regular intervals to preferred contacts for each facility. This can allow contacts to update facility status on their own time without the need for city workers to contact them directly. 

### Organized Response
City workers and volunteers have a need to check in with facilities during the COVID-19 pandemic. The callers need to track who has called who and when, and track the overall trends in automatic updates.

Using this API workers can login and see the status of the city at a glance, and they can prioritize their check-ins based on need and trend.

## Non Goals
What will this project not accomplish?
- No front-end website or app
- No outside data interactions
- Non-city employee full login (dashboard, etc)
- Statistical or analytical endpoints

## Minimum Viable Product
To use this product as quickly as possible we will be implementing the following features:
- User creation
- Contact creation
- Entity creation
- Contact->Entity linking
- Contact single-use login check-in ability

## Components
This application will be broken down into several components. Each will be outlined here.

### API
The API is the application for all intents and purposes. Use of the API and possible paths of use are defined in the flowchart below.
![API Flowchart](/docs/img/api-flowchart.png)

### CI/CD
We will use TravisCI, Docker, Netlify, and AWS to provide constant code deployments and test coverage. 
![CI/CD Pipeline](/docs/img/cicd-pipeline.png)

### Data
This product makes use of [PostgreSQL](https://www.postgresql.org/) for the data layer and [Sequelize](https://sequelize.org/) for database interactions. The schema is outlined below
![Database Diagram](/docs/img/db-diagram.png)

### Application Architecture
The overall application will have several components in support of the code. These will facilitate secure communication between any front end, our API, and the data layer. Additionally our architecture will be designed to be scalable for instances of heavy load. 
![Application Architecture](/docs/img/architecture-diagram.png)

## Roadmap
We estimate the API will be at v1.0.0 by the end of March.

## Contact Info
Give as much, or as little, info as you want here.