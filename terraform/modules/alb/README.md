## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| lb\_sg | Security group IDs for the lb | string | n/a | yes |
| mytags | Tags to include on the resources | map | `<map>` | no |
| cfb\_app\_port | Port number the app will be running on | string | n/a | yes |
| vpc\_id | VPC ID that the lb will be placed in | string | n/a | yes |
| vpc\_subnets | VPC subnets the lb will use | list | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| lb-arn | ARN of the lb |
| lb-dns | DNS name for the lb |
| lb-id | ID of the lb |
| tg-cfb-arn | ARN of Target Group |

