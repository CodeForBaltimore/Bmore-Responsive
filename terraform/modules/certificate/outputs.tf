output "certificate_arn" {
  value = aws_acm_certificate_validation.acm_certificate_validation_record.certificate_arn
}
