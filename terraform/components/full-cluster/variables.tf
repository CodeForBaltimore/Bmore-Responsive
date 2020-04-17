variable "aws_region" {
  description = "AWS Region to use."
  type        = string
  default     = "us-east-2"
}

variable "db_password" {
  type    = string
  default = null
}

variable "smtp_password" {
  type    = string
  default = null
}

variable "public_hosted_zone_name" {}

variable "waf_whitelist_cidrs" {
  type = list(string)
  default = [
    "0.0.0.0/0"
  ]
}

variable "create_waf" {
  type    = bool
  default = false
}

variable "zone_id" {}