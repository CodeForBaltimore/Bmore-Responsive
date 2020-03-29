output "ecs_sg_id" {
  description = "ECS Security Group ID"
  value       = aws_security_group.sg-ecs.id
}

output "alb-sg-id" {
  description = "ALB Security Group ID"
  value       = aws_security_group.sg-alb.id
}

output "sg_postgresql_id" {
  value = aws_security_group.sg_postgresql.id
}