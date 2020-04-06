# db

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| allocated\_storage | The allocated storage in gigabytes. For read replica, set the same value as master's | `string` | n/a | yes |
| apply\_immediately | Specifies whether any database modifications are applied immediately, or during the next maintenance window | `string` | `"false"` | no |
| auto\_minor\_version\_upgrade | Indicates that minor engine upgrades will be applied automatically to the DB instance during the maintenance window | `string` | `"false"` | no |
| availability\_zone | The AZ for the RDS instance. It is recommended to only use this when creating a read replica instance | `string` | `""` | no |
| backup\_retention\_period | The days to retain backups for | `string` | `7` | no |
| backup\_window | The daily time range (in UTC) during which automated backups are created if they are enabled. Before and not overlap with maintenance\_window | `string` | `""` | no |
| db\_subnet\_group\_name | Name of DB subnet group | `string` | `""` | no |
| engine\_version | The postgres engine version | `string` | `""` | no |
| instance\_class | The instance type of the RDS instance | `string` | n/a | yes |
| iops | The amount of provisioned IOPS. Setting this implies a storage\_type of io1 | `string` | `"0"` | no |
| kms\_key\_id | Specifies a custom KMS key to be used to encrypt | `string` | `""` | no |
| maintenance\_window | The window to perform maintenance in. Syntax: 'ddd:hh24:mi-ddd:hh24:mi' | `string` | n/a | yes |
| parameter\_group\_name | Name of the DB parameter group to associate | `string` | n/a | yes |
| password | password for the master DB user | `string` | n/a | yes |
| port | The port on which the DB accepts connections | `string` | `"5432"` | no |
| resource\_suffix | n/a | `string` | `"default"` | no |
| storage\_encrypted | Specifies whether the DB instance is encrypted | `string` | `"true"` | no |
| storage\_type | One of standard (magnetic), gp2 (general purpose SSD), or io1 (provisioned IOPS SSD) | `string` | `"gp2"` | no |
| subnet\_ids | n/a | `any` | n/a | yes |
| username | Username for the master DB user | `string` | `"postgres"` | no |
| vpc\_security\_group\_ids | List of VPC security groups to associate | `list(string)` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| this\_db\_instance\_address | The address of the RDS instance |
| this\_db\_instance\_arn | The ARN of the RDS instance |
| this\_db\_instance\_availability\_zone | The availability zone of the RDS instance |
| this\_db\_instance\_endpoint | The connection endpoint |
| this\_db\_instance\_hosted\_zone\_id | The canonical hosted zone ID of the DB instance (to be used in a Route 53 Alias record) |
| this\_db\_instance\_id | The RDS instance ID |
| this\_db\_instance\_name | The database name |
| this\_db\_instance\_password | The database password (this password may be old, because Terraform doesn't track it after initial creation) |
| this\_db\_instance\_port | The database port |
| this\_db\_instance\_resource\_id | The RDS Resource ID of this instance |
| this\_db\_instance\_status | The RDS instance status |
| this\_db\_instance\_username | The master username for the database |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

