#! /bin/bash

# Exit on all nonzero exit codes.
set -e

# Set AWS Profile to default
export AWS_PROFILE="default"

# Create the builder agent to help us with the rest of the build process
# We run this on all scripts to make sure that the builder is always up-to-date.
docker build -f docker/Dockerfile-Builder -t cfb-build-agent .

# Login to MFA only if the end user has passed in MFA credentials
# If they have not, then there is nothing to do here.
if [ "$#" -gt 0 ]
  then
    # We have entered MFA Parameters
    docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE cfb-build-agent aws-mfa --duration 129600 --device $1
  else
    # No MFA Serial Number has been entered
    echo "No MFA Serial Number entered. Command usage: bin/mfa.sh <MFA Serial Number>"
    echo "Please view DEPLOYING.md to get information about how to find your MFA Serial Number."
fi

# Clean up the stopped build agent containers
docker rm $(docker ps -a -q  --filter ancestor=cfb-build-agent) > /dev/null 2>&1
