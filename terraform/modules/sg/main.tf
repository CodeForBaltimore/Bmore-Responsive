terraform {
  required_version = ">= 0.12"
}

# Create security group

resource "aws_security_group" "sg-alb" {
  name   = "bmore-responsive-alb-access"
  vpc_id = "${var.vpc_id}"

  # Merge tags from environment tfvars and create name tag
  tags = "${merge(map("Name", "bmore-responsive-alb-access"), var.mytags)}"

  ingress {
    # TLS (change to whatever ports you need)
    from_port = 443
    to_port   = 443
    protocol  = "tcp"

    # We open to 0.0.0.0/0 here to support the testing activities.
    # In a production environment, these connections would be limited to
    # approved internal IPs. (10.x.x.x/x block(s))
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}


resource "aws_security_group" "sg-ecs" {
  name   = "bmore-responsive-ecs-host-access"
  vpc_id = "${var.vpc_id}"

  # Merge tags from environment tfvars and create name tag
  tags = "${merge(map("Name", "bmore-responsive-ecs-host-access"), var.mytags)}"

  ingress {
    from_port       = 32768
    to_port         = 61000
    protocol        = "tcp"
    security_groups = ["${aws_security_group.sg-alb.id}"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# TODO: Add SG Rules for ECS ASG and Load Balancer.
