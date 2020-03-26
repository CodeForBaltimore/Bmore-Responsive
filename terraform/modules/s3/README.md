# s3

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |
| random | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| aws\_region | n/a | `any` | n/a | yes |
| mytags | Tags to include on the resources | `map(string)` | `{}` | no |
| resource\_suffix | n/a | `string` | `"default"` | no |

## Outputs

| Name | Description |
|------|-------------|
| output\_bucket\_arn | ARN for the S3 output bucket |
| output\_bucket\_name | Name for the S3 Bucket |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

