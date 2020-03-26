## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|:----:|:-----:|:-----:|
| availability\_zones | The Availability Zones to use in the VPC | list | `<list>` | no |
| mytags | Tags to include on the resources | map | `<map>` | no |
| private\_subnet\_cidrs | The CIDR Blocks of the Private Subnets | list | `<list>` | no |
| public\_subnet\_cidrs | The CIDR Blocks of the Public Subnets | list | `<list>` | no |
| vpc\_cidr | The CIDR block for the VPC | string | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| public-subnet-ids | Subnet IDs |
| subnet-ids | Subnet IDs |
| vpc-id | VPC ID |

