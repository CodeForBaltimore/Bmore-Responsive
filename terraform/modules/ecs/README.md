# ecs

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| bmore-responsive\_container\_definitions | The Rendered JSON of a container definition array. See example-container.json for a sample of valid JSON input. | `string` | n/a | yes |
| bmore-responsive\_container\_name | The name of the container to associate with the Load Balancer. Must equal the container name in the container definition JSON | `string` | n/a | yes |
| bmore-responsive\_container\_port | The port on the container to associate with the Load Balancer | `string` | n/a | yes |
| bmore-responsive\_desired\_count | The number of tasks to run in the service | `string` | n/a | yes |
| bmore-responsive\_target\_group\_arn | The ARN of the Target Group for Load Balancing | `string` | n/a | yes |
| cluster\_name | The name to be given to the ASG | `string` | n/a | yes |
| output\_bucket\_arn | ARN of the S3 bucket that contains the output files | `string` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| cfb\_registry | Address for the Registry |
| ecs\_role | ARN for the role attached to ECS Cluster instances. |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

