#!/bin/bash

# Exit on all nonzero exit codes.
set -e

# Create the builder agent to help us with the rest of the build process
# We run this on all scripts to make sure that the builder is always up-to-date.
docker build -f docker/Dockerfile-Builder -t cfb-build-agent .

# Set AWS Profile to default
export AWS_PROFILE="default"

# Terraform Destroy all of our resources
# We still want to prompt the user for confirmation, especially with an action like this.
docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent destroy full-cluster

# Empty out the Terraform State Bucket
docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent aws s3 rm s3://cfb-healthcare-rollcall-terraform-state --recursive

# Delete the Terraform State Bucket
docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent aws s3api delete-bucket --bucket cfb-healthcare-rollcall-terraform-state --region us-east-1

# Clean up the stopped build agent containers
docker rm $(docker ps -a -q  --filter ancestor=cfb-build-agent) > /dev/null 2>&1
