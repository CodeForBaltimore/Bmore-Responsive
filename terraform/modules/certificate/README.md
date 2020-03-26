# certificate

<!-- BEGINNING OF PRE-COMMIT-TERRAFORM DOCS HOOK -->
## Providers

| Name | Version |
|------|---------|
| aws | n/a |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:-----:|
| dns\_ttl | DNS records TTL | `number` | `60` | no |
| dns\_zone\_id | Route53 Zone id handleling the domains on the certificate | `any` | n/a | yes |
| domain\_name | Main domain name for the SSL certificate | `any` | n/a | yes |
| subject\_alternative\_names | Alternate domain names  for the SSL certificate | `list(string)` | `[]` | no |
| tags | Tags associated to the certificate | `map(string)` | `{}` | no |

## Outputs

| Name | Description |
|------|-------------|
| certificate\_arn | n/a |

<!-- END OF PRE-COMMIT-TERRAFORM DOCS HOOK -->

