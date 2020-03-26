variable "dns_zone_id" {
  description = "Route53 Zone id handleling the domains on the certificate"
}

variable "domain_name" {
  description = "Main domain name for the SSL certificate"
}

variable "dns_ttl" {
  description = "DNS records TTL"
  default     = 60
}

variable "tags" {
  description = "Tags associated to the certificate"
  type        = map(string)
  default     = {}
}

variable "subject_alternative_names" {
  description = "Alternate domain names  for the SSL certificate"
  type        = list(string)
  default     = []
}
