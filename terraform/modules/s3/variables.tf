variable "mytags" {
  description = "Tags to include on the resources"
  type        = map(string)
  default     = {}
}

variable "aws_region" {}

variable "resource_suffix" {
  default = "default"
}