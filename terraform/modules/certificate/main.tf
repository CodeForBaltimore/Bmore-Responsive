terraform {
  required_version = ">= 0.12"
}

resource "aws_acm_certificate" "acm_certificate" {
  domain_name               = var.domain_name
  validation_method         = "DNS"
  subject_alternative_names = var.subject_alternative_names
  tags                      = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "acm_certificate_validation_record" {
  count           = length(var.subject_alternative_names) + 1
  name            = aws_acm_certificate.acm_certificate.domain_validation_options[count.index]["resource_record_name"]
  type            = "CNAME"
  zone_id         = var.dns_zone_id
  records         = [aws_acm_certificate.acm_certificate.domain_validation_options[count.index]["resource_record_value"]]
  ttl             = var.dns_ttl
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "acm_certificate_validation_record" {
  depends_on              = [aws_acm_certificate.acm_certificate]
  certificate_arn         = aws_acm_certificate.acm_certificate.arn
  validation_record_fqdns = aws_route53_record.acm_certificate_validation_record.*.fqdn
}
