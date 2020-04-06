variable "cluster_name" {
  description = "The name to be given to the ASG"
  type        = string
}

variable "asg_security_group_ids" {
  description = "Additional security groups to attach to the ASG."
  type        = list(string)
}

variable "instance_count" {
  description = "The number of instances to provision in the ASG."
  type        = string
}

variable "default_cooldown" {
  description = "Default cooldown for ASG."
  default     = "300"
}

variable "instance_type" {
  description = "The EC2 instance type."
  type        = string
}

variable "max_size" {
  description = "Maximum size for ASG. Must set min, count and max."
  type        = string
}

variable "min_size" {
  description = "Minimum size for ASG. Must set min, count and max."
  type        = string
}

variable "subnet_ids" {
  description = "The subnet IDs used by the Auto Scaling Group."
  type        = list(string)
}

variable "user_data" {
  description = "The user data to provide when launching the instance."
  type        = string
}

variable "root_block_device" {
  type = list(map(string))
  default = [{
    volume_size = "30"
  }]
}

variable "ecs_role" {
  description = "The ARN of the role attached to ECS Cluster instances"
  type        = string
}

