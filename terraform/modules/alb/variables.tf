variable "vpc_id" {
  description = "VPC ID that the lb will be placed in"
}

variable "vpc_subnets" {
  description = "VPC subnets the lb will use"
  type        = list(string)
}

variable "mytags" {
  description = "Tags to include on the resources"
  type        = map(string)
  default     = {}
}

variable "cfb_app_port" {
  description = "Port number the app will be running on"
}

variable "lb_sg" {
  description = "Security group IDs for the lb"
}

variable "certificate_arn" {}