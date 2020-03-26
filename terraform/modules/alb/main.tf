# TODO: Add Documentation about adding HTTPS
# TODO: Make sure APIs have health checks that can be used
# Create ALB
resource "aws_lb" "lb" {
  name               = "bmore-responsive-api-alb"
  internal           = "false"
  load_balancer_type = "application"
  security_groups    = ["${var.lb_sg}"]

  subnets = ["${var.vpc_subnets}"]

  enable_deletion_protection = false

  tags = "${merge(map("Name", "bmore-responsive-api-alb"), var.mytags)}"
}

# Create ALB target group for both containers
resource "aws_lb_target_group" "tg-cfb" {
  name_prefix     = "bmore-responsive-"
  port     = "${var.cfb_app_port}"
  protocol = "HTTP"
  vpc_id   = "${var.vpc_id}"
  depends_on = [
    "aws_lb.lb",
  ]
  lifecycle {
    create_before_destroy = true
  }

  health_check {
    path    = "/health"
  }
}


# Create ALB listener
# TODO: Add ALB Routing rules
resource "aws_lb_listener" "api-listener" {
  load_balancer_arn = "${aws_lb.lb.arn}"
  port              = "80"
  protocol          = "HTTP"

  default_action {
    target_group_arn = "${aws_lb_target_group.tg-cfb.arn}"
    type             = "forward"
  }
}

