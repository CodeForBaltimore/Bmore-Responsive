#!/bin/bash

# Close the whole script after a nonzero exit code
set -e

# Create the builder agent to help us with the rest of the build process
docker build -f docker/Dockerfile-Builder -t cfb-build-agent .

# Set AWS Profile to default
export AWS_PROFILE="default"

# Set values for Bellese SSO

# Login to MFA only if the end user has passed in MFA credentials
if [ "$#" -gt 0 ]
  then
    # We have entered MFA Parameters
    docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent aws-mfa --duration 129600 --device $1
fi

# Build and test the cfb healthcare rollcall api 
# We mount the current directory into /app/ so the agent can see all code and scripts.
# docker run -it cfb-build-agent ./npm-build


# Run Terraform Apply to create the infrastructure
# We still want the end-user to have to accept the Terraform plan before executing.
docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent apply full-cluster

# Get DB outputs
DB_NAME=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster db_instance_name | tr -d '\r')
echo "Db name -> $DB_NAME"

DB_PORT=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster db_instance_port | tr -d '\r')
echo "Db port -> $DB_PORT"

DB_USERNAME=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster db_instance_username | tr -d '\r')
echo "Db username -> $DB_USERNAME"

DB_PASSWORD=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster db_instance_password | tr -d '\r')
echo "Db password -> $DB_PASSWORD"

DB_ENDPOINT=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster db_instance_endpoint | tr -d '\r')
echo "Db endpoint -> $DB_ENDPOINT"

DB_ADDRESS=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster db_instance_address | tr -d '\r')
echo "Db address -> $DB_ADDRESS"

DB_URL="postgres://${DB_USERNAME}:${DB_PASSWORD}@${DB_ENDPOINT}:${DB_PORT}/${DB_NAME}"
echo "DB URL -> $DB_URL"
### Building and Pushing Docker Images ###
docker run -it -v $(pwd):/app/ cfb-build-agent ./db-create
# Log into the ECS Repository first
$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent ecr-login | tr -d '\r')

# Build the container image for the API
docker build -f docker/Dockerfile-Bmore-Responsive -t bmore-responsive \
                        --build-arg DB_URL=${DB_URL}  .
# Get the address of the repository in AWS
CFB_REPO=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster bmore-responsive_registry | tr -d '\r')
# Tag the image for pushing
docker tag bmore-responsive $CFB_REPO:latest
# Push the new docker image
docker push $CFB_REPO

### Get important outputs for the end-user ###
S3_BUCKET=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster output_bucket_name | tr -d '\r')
echo "Output Bucket -> $S3_BUCKET"

LB_DNS=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster load_balancer_address | tr -d '\r')
echo "API URL -> http://${LB_DNS}/"

# Clean up the stopped build agent containers
docker rm $(docker ps -a -q  --filter ancestor=cfb-build-agent) > /dev/null 2>&1
