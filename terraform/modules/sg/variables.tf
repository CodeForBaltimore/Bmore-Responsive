variable "vpc_id" {
  description = "VPC ID"
}

variable "mytags" {
  description = "Tags to include on the resources"
  type        = "map"
  default     = {}
}
