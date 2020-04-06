variable "vpc_cidr" {
  description = "The CIDR block for the VPC"
}

variable "mytags" {
  description = "Tags to include on the resources"
  type        = map(string)
  default     = {}
}

variable "private_subnet_cidrs" {
  description = "The CIDR Blocks of the Private Subnets"
  type        = list(string)
  default     = ["10.0.0.0/24", "10.0.1.0/24", "10.0.2.0/24"]
}

variable "public_subnet_cidrs" {
  description = "The CIDR Blocks of the Public Subnets"
  type        = list(string)
  default     = ["10.0.3.0/24", "10.0.4.0/24", "10.0.5.0/24"]
}

variable "availability_zones" {
  description = "The Availability Zones to use in the VPC"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

