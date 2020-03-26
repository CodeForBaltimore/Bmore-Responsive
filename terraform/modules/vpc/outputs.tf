output "vpc-id" {
  description = "VPC ID"
  value       = aws_vpc.vpc.id
}
output "subnet_ids" {
  description = "Subnet IDs"
  value       = aws_subnet.private-subnet.*.id
}

output "public-subnet-ids" {
  description = "Subnet IDs"
  value       = aws_subnet.public-subnet.*.id
}