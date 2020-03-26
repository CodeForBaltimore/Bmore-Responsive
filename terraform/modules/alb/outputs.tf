output "lb-id" {
  description = "ID of the lb"
  value       = "${aws_lb.lb.id}"
}

output "lb-dns" {
  description = "DNS name for the lb"
  value       = "${aws_lb.lb.dns_name}"
}

output "lb-arn" {
  description = "ARN of the lb"
  value       = "${aws_lb.lb.arn}"
}

output "tg-pricer-arn" {
  description = "ARN of Pricer Target Group"
  value       = "${aws_lb_target_group.tg-cfb.arn}"
}