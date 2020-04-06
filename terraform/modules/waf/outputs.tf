output "web_acl_id" {
  value = aws_wafregional_web_acl.web_acl[0].id
}
