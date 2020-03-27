terraform {
  required_version = ">= 0.12"
}

resource "aws_wafregional_web_acl_association" "web_acl_association" {
  count        = var.create ? 1 : 0
  resource_arn = var.lb_arn
  web_acl_id   = aws_wafregional_web_acl.web_acl[0].id
}

resource "aws_wafregional_ipset" "external_ipset" {
  count = var.create ? 1 : 0
  name  = "GenericMatchExternalIPs${var.resource_suffix}"
  dynamic "ip_set_descriptor" {
    for_each = var.whitelist_cidrs
    content {
      type  = "IPV4"
      value = ip_set_descriptor.value
    }
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_wafregional_rule" "detect_external_access" {
  count       = var.create ? 1 : 0
  name        = "DetectExternalAccess${var.resource_suffix}"
  metric_name = "DetectExternalAccess${var.resource_suffix}"

  predicate {
    data_id = aws_wafregional_ipset.external_ipset[0].id
    negated = false
    type    = "IPMatch"
  }
}

resource "aws_wafregional_web_acl" "web_acl" {
  count       = var.create ? 1 : 0
  name        = "WebAcl${var.resource_suffix}"
  metric_name = "WebAcl${var.resource_suffix}"

  default_action {
    type = "BLOCK"
  }

  rule {
    action {
      type = "ALLOW"
    }

    priority = 1
    rule_id  = aws_wafregional_rule.detect_external_access[0].id
  }
}
