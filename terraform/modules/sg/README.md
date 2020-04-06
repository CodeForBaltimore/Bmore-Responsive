# sg

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| db\_ingress\_cidrs | n/a | `list(string)` | n/a | yes |
| mytags | Tags to include on the resources | `map` | `{}` | no |
| vpc\_id | VPC ID | `any` | n/a | yes |

## Outputs

| Name | Description |
|------|-------------|
| alb-sg-id | ALB Security Group ID |
| ecs\_sg\_id | ECS Security Group ID |
| sg\_postgresql\_id | n/a |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

