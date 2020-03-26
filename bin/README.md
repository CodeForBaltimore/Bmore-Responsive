# Deployment Scripts

## Overview

The following scripts are intended to be used for the deployment of the application infrastructure. They have been developed with ease-of-use in mind and, as such, potential input to the script runtime has been significantly restricted. 

The scripts in this repository can be divided into two categories: **Invoked Scripts** which represent scripts that a developer would call to launch and administer the application infrastructure, and **Utility Scripts** which are leveraged by the Invoked Scripts to perform common tasks as needed.

## Invoked Scripts

The following scripts are used to control the lifecycle of the application infrastructure. For detailed information about how to launch the infrastructure, please see the [Deployment Documentation](../DEPLOYING.md)

**All invoked scripts should be run from the root of this repository.**

### deploy

##### Usage

  ```bin/deploy.sh arn:aws:iam::<account number>:mfa/<username>```

The addition of an MFA resource is optional and only required if you are using MFA on your AWS account. If this value is not included, the script will not attempt to generate multi-factor credentials.

##### Description
The deploy script is the main driver for deployment. The usage of the script is described in [DEPLOYING.md](../DEPLOYING.md) and documentation on the individual steps performed in the script are detailed inline as comments.

The most common usage scenario for the deploy script is to perform a full standup of the application infrastructure when newly launching the application or modifying the terraform component(s) that comprise the application runtime environment.

The deploy script completes the following steps:
- Create the Build Agent Docker image (See the [Docker Documentation](../docker/README.md) for more information)
- Ensure that the AWS is configured correctly and attempt an MFA sign-in if the user has passed an MFA device in.
- Builds the API code.
- Creates the Terraform Bucket to hold infrastructure state. (Note: If the bucket exists already, this step does nothing.)
- Runs `terraform apply` to generate the application infrastructure
- Logs into the Amazon Container Registry
- Builds and pushes Docker image for the bmore-responsive api.
- Outputs the S3 Bucket and API addresses for use in interfacing with the APIs
- Cleans up Docker containers that were created as a result of the build process

In the event that any of the above steps return a nonzero error code, the deploy script halts.

### redeploy

##### Usage

`bin/redeploy.sh`

##### Description

The redeploy script is intended for use when any application code for the API or Docker image is modified. When this happens, developers are able to run this script which performs the following actions:

- Rebuilds the Docker Build Agent
- Ensures that AWS is configured correctly
- Builds the API
- Logs into the Amazon Container Registry
- Builds and pushes Docker images for the bmore-responsive api.
- Triggers a container redeployment through the AWS CLI
- Cleans up Docker containers that were created as a result of the build process

Once the redeploy script is run, the bmore-responsive containers will go through the standard AWS rolling redeployment process. In this process, existing containers are kept running while new ones are created and registered as healthy. If the new containers are successfully marked healthy, old containers are drained and removed. This process takes about 5 minutes on average.

The redeploy script is only intended for the redeployment of API code. In the event of a change to any terraform component(s), the `deploy.sh` script should be used to ensure that changes are applied correctly and propagated to all infrastructure components.

**Please note** that the redeploy script does not attempt to perform the MFA login again. It assumes that you have a valid AWS session available when trying to use the script. In the event that this is not the case, the `bin/mfa.sh` script has been supplied to allow multi-factor login.

### cleanup

##### Usage

##### Description

The cleanup script is intended to be used when the application infrastructure is no longer desired. The script will destroy all terraform resources, clear the S3 buckets, and delete the terraform state bucket. **Running this script to completion will render your infrastructure unrecoverable without a full run of `deploy.sh`**

The cleanup script performs the following steps:

- Rebuilds the Docker Build Agent
- Ensures that AWS is configured correctly
- Runs `terraform destroy` **Note:** The developer running this script will be prompted to accept the destruction of the environment.
- Empties the terraform state bucket in use by the infrastructure
- Deletes the terraform state bucket in use by the infrastructure
- Cleans up Docker containers that were created as a result of the build process

### mfa

##### Usage

```bin/mfa.sh arn:aws:iam::<account number>:mfa/<username>```

The addition of an MFA resource is required. If this value is not included, the script will not do anything.

##### Description

This script is a simple wrapper to enable developers to log into AWS MFA for use in the `redeploy.sh` and `cleanup.sh` scripts. It should only be used in the event that a user has not run the `deploy.sh` script recently (or at all) or if their AWS credentials have expired after the given period (36 hours). The script performs the following actions:

- Rebuilds the Docker Build Agent
- Ensures that AWS is configured correctly
- Attempts AWS MFA sign in with the given user credentials
- Cleans up Docker containers that were created as a result of the build process

### Notes

- Every script used for major operations rebuilds the Docker Build Agent. This is to ensure that the agent is at its latest state if changes have occurred between the latest container build and the latest source code updates.

## Utility Scripts

Utility scripts are simple shell scripts designed to be run by the Docker Build Agent when performing application infrastructure administration tasks. They are largely simple scripts designed to strip some complexity from the Invoked Scripts and make them more readable.

**Note:** Most of these scripts require an active AWS session in order to run correctly. Please view the documentation above for `mfa.sh` or `deploy.sh` for more information.  

### apply

##### Usage

`apply <Terraform Component> <Extra Args>`

- Terraform Component is the name of the terraform component being deployed. The script will cd to that component's folder and run all build actions from there.
- Extra Args are any other arguments that are normally passed to `terraform apply`. A complete list can be found at the [Terraform Docs](https://www.terraform.io/docs/commands/apply.html)

##### Description

The apply script is designed to be used when Invoked Scripts require terraform to deploy new resources. Apply performs three actions:

- Enters the correct directory for the specified terraform component
- Initializes terraform
- Runs `terraform apply` with any additional arguments


### create-bucket

##### Usage

`create-bucket`

##### Description

This script creates the S3 bucket required for maintaining terraform state. Currently, the target bucket name is hard-coded to `cfb-healthcare-rollcall-terraform-state`. The bucket is created in the `us-east-1` region by default.

### destroy

##### Usage

`destroy <Terraform Component> <Extra Args>`

- Terraform Component is the name of the terraform component being deployed. The script will cd to that component's folder and run all build actions from there.
- Extra Args are any other arguments that are normally passed to `terraform destroy`. A complete list can be found at the [Terraform Docs](https://www.terraform.io/docs/commands/destroy.html)

##### Description

The destroy script is designed to be used when Invoked Scripts require terraform to destroy resources. The script performs three actions:

- Enters the correct directory for the specified terraform component
- Initializes terraform
- Runs `terraform destroy` with any additional arguments

**Note:** Unless `--force` is specified as an extra argument, invoking the `destroy` script will prompt the user for confirmation before performing any actions.

### ecr-login

##### Usage

`ecr-login`

This script is commonly used, however, to invoke a docker login command as such:

`$(ecr-login)`

##### Description

The `ecr-login` script is a simple helper script to wrap the action of logging into the Amazon Elastic Container Registry for your AWS account. This is a necessary step before the execution of any `docker push` activities to the remote AWS Container Registry.

### npm-build

##### Usage

`npm-build `

##### Description

- installs dependencies with  `npm install`
- tests code with 'npm test'
- lints code with 'npm lint'

### output

##### Usage

`output <Terraform Component> <Extra Args>`

- Terraform Component is the name of the terraform component being deployed. The script will cd to that component's folder and run all build actions from there.
- Extra Args are any other arguments that are normally passed to `terraform output`. A complete list can be found at the [Terraform Docs](https://www.terraform.io/docs/commands/output.html)

##### Description

The output script is designed to be used when Invoked Scripts require access to any of the outputs from the terraform component. The script performs three actions:

- Enters the correct directory for the specified terraform component
- Initializes terraform
- Runs `terraform output` with any additional arguments

This script is primarily used to pass information about terraform-created resources to other commands in subsequent steps of Invoked Scripts. Additionally, it is used to output information to developers and end-users of the deployment script(s).
