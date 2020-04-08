output "ec2_id" {
  description = "ec2 instance ID"
  value       = "${aws_instance.ec2.*.id}"
}

output "ec2_dns" {
  description = "ec2 instance public DNS name"
  value       = "${aws_instance.ec2.*.public_dns}"
}

output "ec2_ip" {
  description = "ec2 IP public address"
  value       = "${aws_instance.ec2.*.public_ip}"
}