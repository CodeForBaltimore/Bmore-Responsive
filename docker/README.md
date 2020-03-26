# Docker Images

## Docker Build Agent

### Overview
The Docker Build Agent is a tool designed to satisfy the deployment dependencies for the Provider Matching and FQHC Pricer APIs. A common task, when modernizing systems and deploying resources to new environments such as AWS, is the installation of tools such as Terraform, Python, the AWS CLI, and Java. The introduction of these installation requirements and instructions leaves extensive room for human error or accidental misconfiguration as the result of unnoticed environmental differences.

In order to solve this problem, the Docker Build Agent was developed in order to include all dependencies needed at known versions and configurations. All deployment scripts (as detailed in the [Deployment Script Documentation](../bin/README.md)) utilize this image to ensure that any development or evaluation machine is running the exact same version of every necessary tool with exactly the same configuration. As a direct result, developers interfacing with this repository only require Docker installed on their system, eliminating several steps in the onboarding process for new team members or modernization efforts.

### Included Software

The Build Agent includes the following software for development and deployment activities:

- Java
- Apache Maven
- Terraform
- Python & pip
- AWS CLI & MFA Tools

### Building the Agent

The Build Agent is built during the normal operation of the `deploy`, `redeploy`, `cleanup`, and `mfa` scripts. This should ensure that the agent is always at the latest state when running infrastructure administration scripts. In the event that a build needs to be done outside of those scripts, the following command can be used:

`docker build -f docker/Dockerfile-Builder -t mpsm-build-agent . `

This command assumes that you are running the build command from the root directory of the repository. If you are running it from any other directory, modify the `-f` statement with the relative path to the Dockerfile-Builder file.

### Running the Agent

As with the build process, the agent is most commonly run when using the Deployment Scripts in the `bin` folder. In the event, however, that the agent has to be run outside these scripts, the following command can be run:

`docker run -it -v $(pwd):/app/ -v $(pwd)/docker/aws/:/root/.aws/ -e AWS_PROFILE=$AWS_PROFILE mpsm-build-agent <Command>`

Breaking down the command above, we get the following:
- `docker run -it` launches the container and enables it to log output to the console window for monitoring and accept user input as needed.
- `-v $(pwd):/app/` mounts the entire working directory to the `/app/` folder on the container. This enables the container to see all files in the project and interact with them. **Note:** Anything the container does to files in `/app/` happens on the host OS as well. Be careful with what you mount.
- `-v $(pwd)/docker/aws/:/root/.aws` is a special volume mount that enables developers to login to the AWS CLI with the files in `docker/aws/`. Additionally, the `mfa` script detailed in [Deployment Scripts](../bin/README.md) writes MFA credentials to this file which enables us to keep our MFA session across multiple Build Agent instances.
- `-e AWS_PROFILE=$AWS_PROFILE` sets the `AWS_PROFILE` environment variable on the container. This is needed for the AWS CLI if a value other than `default` is used.
- `mpsm-build-agent <Command>` invokes the container image and a command to run. A List of helper scripts is found in the [Deployment Scripts](../bin/README.md) section.

Please note that this example is for a run command launched from the root directory of the repository.

### AWS Credentials

In the `docker/` folder of the repository is a directory called `/aws/` which contains the files `config` and `credentials`. These files and directory represent an isolated AWS CLI credentials environment that is mounted to the Build Agent as needed for activities such as terraform invocations or AWS CLI calls. These files are passed to every running instance of the Build Agent and enable the developer to log into the AWS CLI without needing it installed on their local machine.

**Warning:** The Credentials file has been added to source control for distribution purposes only. Please **DO NOT COMMIT ANY CHANGES TO THE CREDENTIALS FILE.**   

## Provider Matching and FQHC Pricer Containers

### Overview
In addition to the Build Agent, there are also two files labeled `Dockerfile-Matching` and `Dockerfile-FQHC` which control the creation of Docker images for the Provider Matching and FQHC Pricer APIs respectively. These are both Java containers which have been configured to enable easy deployment of the application to any system running Docker.

### Building the Images

In the event that a build needs to be done outside of the `deploy` or `redeploy` scripts, the following command can be used:

`docker build -f docker/Dockerfile-Matching -t provider-matching . `

or

`docker build -f docker/Dockerfile-FQHC -t fqhc-pricer . `

This command assumes that you are running the build command from the root directory of the repository. If you are running it from any other directory, modify the `-f` statement with the relative path to the appropriate Dockerfile

### Running the Images

The application infrastructure for this challenge has been designed to deploy these containers into an AWS ECS cluster. This task is performed by the `deploy` and `redeploy` scripts. In the event that either container needs to be started locally, the following commands can be run:

##### Provider Matching
The following command launches a daemonized version of the Provider Matching API listening on Port 8080:

`docker run -d -e AWS_REGION=us-east-1 -e AWS_BUCKET=<Bucket Address> -v $(pwd)/docker/aws/:/root/.aws/ -p 8080:8080 provider-matching`

- The environment variable `AWS_REGION` is set to `us-east-1` by default, however it can be changed to whichever region your S3 bucket is deployed to.
- The environment variable `AWS_BUCKET` is the address of the S3 bucket to output provider matching files to.
- The AWS environment variables are required for the container to output to the target S3 bucket after entries have been processed into .txt files.
- `-v $(pwd)/docker/aws/:/root/.aws/` enables the container to write to the target S3 bucket. **Note:** This assumes that you have a valid AWS session and permission to write to the target S3 bucket.
- `-p 8080:8080` binds local port 8080 to the internal docker port 8080.

##### FQHC Pricer
The following command launches a daemonized version of the FQHC Pricer API listening on Port 8080:

`docker run -d -p 8080:8080 fqhc-pricer`
- `-p 8080:8080` binds local port 8080 to the internal docker port 8080.
