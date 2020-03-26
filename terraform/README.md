# Terraform

## Overview

The infrastructure for this application has been designed to be launched and configured via terraform. This enables us to store the application infrastructure as code, share the infrastructure state via terraform's built-in support for AWS S3 state storage, and maintain infrastructure state easily though a series of scripts (as defined in [Deployment Scripts](../bin/README.md)).

## Components

### full-cluster

The full-cluster component represents an ECS cluster running in its own, dedicated VPC. Please see the [README](components/full-cluster/README.md) for more details. 

## Modules
Each module contains its own README.md which includes information about its functionality. Please refer to individual module documentation for more information about inputs, outputs, and behaviors of each module.

| Module  | Documentation  |
|---|---|
| ALB |[README.md](modules/alb/README.md)|
| ASG |[README.md](modules/asg/README.md)|
| ECS |[README.md](modules/ecs/README.md)|
| S3 |[README.md](modules/s3/README.md)|
| SG |[README.md](modules/sg/README.md)|
| VPC |[README.md](modules/vpc/README.md)|
