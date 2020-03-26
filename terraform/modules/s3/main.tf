resource "aws_s3_bucket" "output-bucket" {
  bucket        = "mpsm-provider-matching-output"
  acl           = "private"
  force_destroy = "true"
  tags          = "${merge(map("Name", "mpsm-provider-matching-output"), var.mytags)}"
}
