output "output_bucket_arn" {
  description = "ARN for the S3 output bucket"
  value       = "${aws_s3_bucket.output-bucket.arn}"
}

output "output_bucket_name" {
  description  = "Name for the S3 Bucket"
  value        = "${aws_s3_bucket.output-bucket.id}"
}
