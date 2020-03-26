output "output_bucket_name" {
  description     = "Name of the output s3 bucket"
  value           = "${module.s3.output_bucket_name}"
}

output "bmore-responsive_registry" {
  description     = "Name of the Bmore Response Registry"
  value           = "${module.ecs_cluster.cfb_registry}"
}


output "load_balancer_address" {
  description     = "DNS Address of the Application Load Balancer"
  value           = "${module.alb.lb-dns}"
}

output "db_instance_name" {
  description = "The database name"
  value       = "${module.db.this_db_instance_name}"
}
output "db_instance_port" {
  description = "The database port"
  value       = "${module.db.this_db_instance_port}"
}

output "db_instance_username" {
  description = "The master username for the database"
  value       = "${module.db.this_db_instance_username}"
}

output "db_instance_password" {
  description = "The database password (this password may be old, because Terraform doesn't track it after initial creation)"
  value       = "${module.db.this_db_instance_password}"
}

output "db_instance_address" {
  description = "The address of the RDS instance"
  value       = "${module.db.this_db_instance_address}"
}

output "db_instance_endpoint" {
  description = "The connection endpoint"
  value       = "${module.db.this_db_instance_endpoint}"
}