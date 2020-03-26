
// Fill in information about the ECS host node here.
data "aws_ami" "ecs_agent_ami" {
  most_recent = true
  owners      = ["amazon"]

  filter {
      name   = "name"
      values = ["*amazon-ecs-optimized"]
  }

  filter {
      name   = "virtualization-type"
      values = ["hvm"]
  }
}

resource "aws_autoscaling_group" "ecs_cluster_asg" {
  lifecycle {
    create_before_destroy = true
  }

  default_cooldown          = "${var.default_cooldown}"
  desired_capacity          = "${var.count}"
  health_check_grace_period = 300
  launch_configuration      = "${aws_launch_configuration.ecs_cluster_config.name}"
  max_size                  = "${var.max_size}"
  min_size                  = "${var.min_size}"
  name                      = "bmore-responsive-ecs-cluster-asg"
  vpc_zone_identifier       = ["${var.subnet_ids}"]

  tags = [
    {
      key                 = "Name"
      value               = "bmore-responsive-ecs-cluster-asg"
      propagate_at_launch = true
    },
    {
      key                 = "ECS Cluster"
      value               = "${var.cluster_name}"
      propagate_at_launch = true
    },
  ]
}

resource "aws_launch_configuration" "ecs_cluster_config" {
  lifecycle {
    create_before_destroy = true
  }

  root_block_device = "${var.root_block_device}"

  enable_monitoring    = "true"
  iam_instance_profile = "${var.ecs_role}"
  image_id             = "${data.aws_ami.ecs_agent_ami.image_id}"
  instance_type        = "${var.instance_type}"
  name_prefix          = "bmore-responsive-ecs-cluster-"
  security_groups = ["${var.asg_security_group_ids}"]

  user_data = "${var.user_data}"
}
