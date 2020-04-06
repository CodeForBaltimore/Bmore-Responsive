terraform {
  required_version = ">= 0.12"
}

resource "random_pet" "random_pet" {
  length = 2
}

resource "aws_s3_bucket" "output-bucket" {
  bucket        = "cfb-healthcare-rollcall-${var.aws_region}-${var.resource_suffix}"
  acl           = "private"
  force_destroy = "true"
  tags          = merge(map("Name", "cfb-healthcare-rollcall-${var.aws_region}-${random_pet.random_pet.id}"), var.mytags)
}
