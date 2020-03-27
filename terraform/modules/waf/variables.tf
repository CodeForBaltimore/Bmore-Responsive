variable "whitelist_cidrs" {
  type = list(string)
}

variable "resource_suffix" {}

variable "lb_arn" {}

variable "create" {
  type    = bool
  default = false
}