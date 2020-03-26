# vpc

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| availability\_zones | The Availability Zones to use in the VPC | `list(string)` | <pre>[<br>  "us-east-1a",<br>  "us-east-1b",<br>  "us-east-1c"<br>]</pre> | no |
| mytags | Tags to include on the resources | `map(string)` | `{}` | no |
| private\_subnet\_cidrs | The CIDR Blocks of the Private Subnets | `list(string)` | <pre>[<br>  "10.0.0.0/24",<br>  "10.0.1.0/24",<br>  "10.0.2.0/24"<br>]</pre> | no |
| public\_subnet\_cidrs | The CIDR Blocks of the Public Subnets | `list(string)` | <pre>[<br>  "10.0.3.0/24",<br>  "10.0.4.0/24",<br>  "10.0.5.0/24"<br>]</pre> | no |
| vpc\_cidr | The CIDR block for the VPC | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| public-subnet-ids | Subnet IDs |
| subnet\_ids | Subnet IDs |
| vpc-id | VPC ID |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

