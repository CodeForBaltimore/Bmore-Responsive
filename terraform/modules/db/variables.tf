variable "engine_version" {
  type        = string
  description = "The postgres engine version"
  default     = ""
}

variable "instance_class" {
  type        = string
  description = "The instance type of the RDS instance"
}

variable "username" {
  type        = string
  description = "Username for the master DB user"
  default     = "postgres"
}

variable "password" {
  type        = string
  description = "password for the master DB user"
}

variable "port" {
  type        = string
  description = "The port on which the DB accepts connections"
  default     = "5432"
}

variable "allocated_storage" {
  type        = string
  description = "The allocated storage in gigabytes. For read replica, set the same value as master's"
}

variable "storage_type" {
  type        = string
  description = "One of standard (magnetic), gp2 (general purpose SSD), or io1 (provisioned IOPS SSD)"
  default     = "gp2"
}

variable "iops" {
  type        = string
  description = "The amount of provisioned IOPS. Setting this implies a storage_type of io1"
  default     = "0"
}

variable "storage_encrypted" {
  type        = string
  description = "Specifies whether the DB instance is encrypted"
  default     = "true"
}

variable "kms_key_id" {
  type        = string
  description = "Specifies a custom KMS key to be used to encrypt"
  default     = ""
}

variable "vpc_security_group_ids" {
  type        = list(string)
  description = "List of VPC security groups to associate"
}

variable "db_subnet_group_name" {
  type        = string
  description = "Name of DB subnet group"
  default     = ""
}

variable "parameter_group_name" {
  type        = string
  description = "Name of the DB parameter group to associate"
}

variable "availability_zone" {
  type        = string
  description = "The AZ for the RDS instance. It is recommended to only use this when creating a read replica instance"
  default     = ""
}

variable "auto_minor_version_upgrade" {
  type        = string
  description = "Indicates that minor engine upgrades will be applied automatically to the DB instance during the maintenance window"
  default     = "false"
}

variable "apply_immediately" {
  type        = string
  description = "Specifies whether any database modifications are applied immediately, or during the next maintenance window"
  default     = "false"
}

variable "maintenance_window" {
  type        = string
  description = "The window to perform maintenance in. Syntax: 'ddd:hh24:mi-ddd:hh24:mi'"
}

variable "backup_retention_period" {
  type        = string
  description = "The days to retain backups for"
  default     = 7
}

variable "backup_window" {
  type        = string
  description = "The daily time range (in UTC) during which automated backups are created if they are enabled. Before and not overlap with maintenance_window"
  default     = ""
}

variable "subnet_ids" {
  //  type = list(string)
}

variable "resource_suffix" {
  default = "default"
}

