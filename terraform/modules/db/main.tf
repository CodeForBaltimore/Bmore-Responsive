terraform {
  required_version = ">= 0.12"
}

resource "aws_db_subnet_group" "subnet_group" {
  subnet_ids = var.subnet_ids
}

resource "aws_db_instance" "this" {
  identifier = "healthcare-rollcall-postgres"

  engine            = "postgres"
  engine_version    = var.engine_version
  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage
  username          = var.username
  password          = var.password
  port              = var.port

  //  allocated_storage = "${var.allocated_storage}"
  storage_type      = var.storage_type
  iops              = var.iops
  storage_encrypted = var.storage_encrypted
  kms_key_id        = var.kms_key_id
  name              = "healthcareRollcallDB"

  # NOTE: Do NOT use 'user' as the value for 'username' as it throws:
  # "Error creating DB Instance: InvalidParameterValue: MasterUsername
  # user cannot be used as it is a reserved word used by the engine"

  vpc_security_group_ids = var.vpc_security_group_ids

  publicly_accessible = false

  maintenance_window = var.maintenance_window
  backup_window      = var.backup_window

  # disable backups to create DB faster
  backup_retention_period = 0

  tags = {
    Owner       = "user"
    Environment = "dev"
    Name        = "healthcare-rollcall_db"
  }

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  # DB subnet group
  db_subnet_group_name = aws_db_subnet_group.subnet_group.name

  # Snapshot name upon DB deletion
  final_snapshot_identifier = "healthcare-rollcall-db-${var.resource_suffix}"

  # Database Deletion Protection
  deletion_protection = false

  lifecycle {
    ignore_changes = [password]
  }
}

