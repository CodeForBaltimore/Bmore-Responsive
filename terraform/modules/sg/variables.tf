variable "vpc_id" {
  description = "VPC ID"
}

variable "mytags" {
  description = "Tags to include on the resources"
  type        = "map"
  default     = {}
}

variable "db_ingress_cidrs" {
  type = list(string)
}