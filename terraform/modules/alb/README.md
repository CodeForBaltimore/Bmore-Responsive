# alb

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| certificate\_arn | n/a | `any` | n/a | yes |
| cfb\_app\_port | Port number the app will be running on | `any` | n/a | yes |
| lb\_sg | Security group IDs for the lb | `any` | n/a | yes |
| mytags | Tags to include on the resources | `map(string)` | `{}` | no |
| vpc\_id | VPC ID that the lb will be placed in | `any` | n/a | yes |
| vpc\_subnets | VPC subnets the lb will use | `list(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| lb-arn | ARN of the lb |
| lb-dns | DNS name for the lb |
| lb-id | ID of the lb |
| tg-cfb-arn | ARN of the Target Group |
| zone\_id | n/a |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

