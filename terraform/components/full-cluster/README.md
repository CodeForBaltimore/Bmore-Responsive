# full-cluster

## Infrastructure Requirements
 - [x] Public DNS Record
 - [x] SSL/TLS termination at the ALB
 - [x] IP whitelisting via WAF
 - [ ] Auto db credential rotation via Lambda
 
<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | 2.54.0 |
| random | n/a |
| template | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| aws\_region | AWS Region to use. | `string` | `"us-east-2"` | no |
| create\_waf | n/a | `bool` | `false` | no |
| db\_password | n/a | `string` | n/a | yes |
| public\_hosted\_zone\_name | n/a | `any` | n/a | yes |
| waf\_whitelist\_cidrs | n/a | `list(string)` | <pre>[<br>  "0.0.0.0/0"<br>]</pre> | no |
| zone\_id | n/a | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| bmore-responsive\_registry | Name of the Bmore Response Registry |
| db\_instance\_address | The address of the RDS instance |
| db\_instance\_endpoint | The connection endpoint |
| db\_instance\_name | The database name |
| db\_instance\_password | The database password (this password may be old, because Terraform doesn't track it after initial creation) |
| db\_instance\_port | The database port |
| db\_instance\_username | The master username for the database |
| load\_balancer\_address | DNS Address of the Application Load Balancer |
| output\_bucket\_name | Name of the output s3 bucket |
| public\_hosted\_zone\_nameservers | n/a |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->