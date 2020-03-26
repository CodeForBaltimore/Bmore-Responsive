terraform {
  backend "s3" {
    bucket         = "cfb-healthcare-rollcall-terraform-state"
    key            = "cfb-healthcare-rollcall/terraform/terraform.tfstate"
    region         = "us-east-1"
  }
}

provider "aws" {
  region = "${var.aws_region}"
}

# Set up output S3 Bucket
module "s3" {
  source            = "../../modules/s3"
}

# Set up template files

data "template_file" "cfb_ecs_task_definition" {
  template = "${file("cfb-container.json.tpl")}"
  vars          = {
    image_address = "${module.ecs_cluster.cfb_registry}"
    s3_bucket     = "${module.s3.output_bucket_name}"
  }
}


data "template_file" "user_data" {
  template        = "${file("userdata.sh.tpl")}"
  vars            = {
    cluster_name  = "bmore-responsive-cluster"
  }
}


# Set up AWS Resources

module "vpc" {
  source      = "../../modules/vpc"
  vpc_cidr    = "10.0.0.0/16"
}

module "sg" {
  source      = "../../modules/sg"
  vpc_id      = "${module.vpc.vpc-id}"
}

module "alb" {
  source            = "../../modules/alb"
  vpc_id            = "${module.vpc.vpc-id}"
  vpc_subnets       = "${module.vpc.public-subnet-ids}"
  lb_sg             = "${module.sg.alb-sg-id}"
  cfb_app_port      = 8080
}

module "ecs_cluster" {
  source            = "../../modules/ecs"
  cluster_name      = "bmore-responsive-cluster"
  output_bucket_arn = "${module.s3.output_bucket_arn}"
  cfb_desired_count     = "3"
  cfb_target_group_arn  = "${module.alb.tg-cfb-arn}"
  cfb_container_name    = "bmore-responsive"
  cfb_container_port    = "8080"
  cfb_container_definitions  = "${data.template_file.cfb_ecs_task_definition.rendered}"

}

module "asg" {
  source            = "../../modules/asg"
  min_size          = 3
  max_size          = 6
  count             = 3
  instance_type     = "t3.medium"
  user_data         = "${data.template_file.user_data.rendered}"
  cluster_name      = "bmore-responsive-cluster"
  subnet_ids        = "${module.vpc.subnet-ids}"
  asg_security_group_ids  = ["${module.sg.ecs-sg-id}"]
  ecs_role          = "${module.ecs_cluster.ecs_role}"
}

module "db" {
  source                  = "../../modules/db"
  engine_version          = "10.6"
  instance_class          = "db.m3.medium"
  username                = "cfb_user"
  password                = "CCx71@!k09mBbv6"
  port                    = "5432"
  allocated_storage       = "20"
  vpc_security_group_ids  = "${module.sg.alb-sg-id}"
  db_subnet_group_name   = "CFB Subnets"
  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
}
