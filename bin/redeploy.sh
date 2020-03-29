#!/bin/bash

# Exit on all nonzero exit codes.
set -e

# Set AWS Profile to default
export AWS_PROFILE="default"

# Create the builder agent to help us with the rest of the build process
# We run this on all scripts to make sure that the builder is always up-to-date.
docker build -f docker/Dockerfile-Builder -t cfb-build-agent .


# Rebuild the Java Projects
#docker run -it -v $(pwd):/app/ cfb-build-agent npm-build 


### Building and Pushing Docker Images ###
# Log into the ECS Repository first
$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent ecr-login | tr -d '\r')

# Build the container image 
docker build -f docker/Dockerfile-Bmore-Responsive -t bmore-responsive .
# Get the address of the repository in AWS
CFB_REPO=$(docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent output full-cluster bmore-responsive_registry | tr -d '\r')
echo "CFB_REPO -> $CFB_REPO"

# Tag the image for pushing
docker tag bmore-responsive:latest $CFB_REPO:latest
# Push the new docker image
docker push $CFB_REPO


# Trigger AWS to Redeploy the running containers.
docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent aws ecs update-service --service bmore-responsive --cluster bmore-responsive-cluster --region us-east-1 --force-new-deployment


# Clean up the stopped build agent containers
docker rm $(docker ps -a -q  --filter ancestor=cfb-build-agent) > /dev/null 2>&1
