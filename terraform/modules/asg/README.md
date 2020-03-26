## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| asg\_security\_group\_ids | Additional security groups to attach to the ASG. | list | n/a | yes |
| cluster\_name | The name to be given to the ASG | string | n/a | yes |
| count | The number of instances to provision in the ASG. | string | `"1"` | no |
| default\_cooldown | Default cooldown for ASG. | string | `"300"` | no |
| ecs\_role | The ARN of the role attached to ECS Cluster instances | string | n/a | yes |
| instance\_type | The EC2 instance type. | string | n/a | yes |
| max\_size | Maximum size for ASG. Must set min, count and max. | string | n/a | yes |
| min\_size | Minimum size for ASG. Must set min, count and max. | string | n/a | yes |
| root\_block\_device |  | list | `<list>` | no |
| subnet\_ids | The subnet IDs used by the Auto Scaling Group. | list | n/a | yes |
| user\_data | The user data to provide when launching the instance. | string | n/a | yes |

