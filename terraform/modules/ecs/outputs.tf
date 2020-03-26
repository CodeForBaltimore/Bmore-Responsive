output "cfb_registry" {
  description = "Address for the Registry"
  value       = aws_ecr_repository.bmore-responsive-api.repository_url
}

output "ecs_role" {
  description = "ARN for the role attached to ECS Cluster instances."
  value       = aws_iam_instance_profile.ecs_cluster_asg_profile.name
}

