# Create EC2 instance
resource "aws_instance" "ec2" {
  ami           = "${var.ec2_ami}"
  count         = "${var.ec2_instance_count}"
  instance_type = "${var.ec2_instance_type}"
  subnet_id     = "${element(var.subnet_ids, count.index)}"
  vpc_security_group_ids = "${var.vpc_sg}"
  monitoring = true
  iam_instance_profile = "${var.ecs_role}"
  user_data_base64 = base64encode(var.user_data)
  tags = var.tags
}