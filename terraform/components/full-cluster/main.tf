terraform {
  required_version = "0.12.6"
  backend "s3" {
    bucket  = "cfb-healthcare-rollcall-us-east-2-terraform-state"
    key     = "cfb-healthcare-rollcall/terraform/terraform.tfstate"
    region  = "us-east-2"
    encrypt = true
  }
}

provider "aws" {
  version = "2.54.0"
  region  = var.aws_region
}

# Set up output S3 Bucket
module "s3" {
  source          = "../../modules/s3"
  resource_suffix = random_pet.random_pet.id
  aws_region      = var.aws_region
}

# Set up template files

data "template_file" "cfb_ecs_task_definition" {
  template = file("cfb-container.json.tpl")
  vars = {
    image_address = module.ecs_cluster.cfb_registry
    s3_bucket     = module.s3.output_bucket_name
  }
}

data "template_file" "user_data" {
  template = file("userdata.sh.tpl")
  vars = {
    cluster_name = "bmore-responsive-cluster"
  }
}

# Set up AWS Resources

resource "random_pet" "random_pet" {
  length = 2
}

module "vpc" {
  source   = "../../modules/vpc"
  vpc_cidr = "10.0.0.0/16"
}

module "sg" {
  source = "../../modules/sg"
  vpc_id = module.vpc.vpc-id
}

data "aws_route53_zone" "hosted_zone" {
  zone_id = var.zone_id
}

module "certificate" {
  source      = "../../modules/certificate"
  dns_zone_id = data.aws_route53_zone.hosted_zone.zone_id
  domain_name = "api.${data.aws_route53_zone.hosted_zone.name}"
}

module "dns_record" {
  source      = "../../modules/dns_record"
  name        = "api.${data.aws_route53_zone.hosted_zone.name}"
  zone_id     = data.aws_route53_zone.hosted_zone.zone_id
  lb_dns_name = module.alb.lb-dns
  lb_zone_id  = module.alb.zone_id
}

module "alb" {
  source          = "../../modules/alb"
  vpc_id          = module.vpc.vpc-id
  vpc_subnets     = module.vpc.public-subnet-ids
  lb_sg           = module.sg.alb-sg-id
  cfb_app_port    = 8080
  certificate_arn = module.certificate.certificate_arn
}

module "waf" {
  source          = "../../modules/aws_wafregional_web_acl"
  whitelist_cidrs = var.waf_whitelist_cidrs
  lb_arn          = module.alb.lb-arn
  resource_suffix = random_pet.random_pet.id
}

module "ecs_cluster" {
  source                                 = "../../modules/ecs"
  cluster_name                           = "bmore-responsive-cluster"
  output_bucket_arn                      = module.s3.output_bucket_arn
  bmore-responsive_desired_count         = "3"
  bmore-responsive_target_group_arn      = module.alb.tg-cfb-arn
  bmore-responsive_container_name        = "bmore-responsive"
  bmore-responsive_container_port        = "8080"
  bmore-responsive_container_definitions = data.template_file.cfb_ecs_task_definition.rendered
}

module "asg" {
  source                 = "../../modules/asg"
  min_size               = 3
  max_size               = 6
  instance_count         = 3
  instance_type          = "t3.medium"
  user_data              = data.template_file.user_data.rendered
  cluster_name           = "bmore-responsive-cluster"
  subnet_ids             = module.vpc.subnet_ids
  asg_security_group_ids = [module.sg.ecs_sg_id]
  ecs_role               = module.ecs_cluster.ecs_role
}

module "db" {
  source                 = "../../modules/db"
  resource_suffix        = random_pet.random_pet.id
  engine_version         = "10.6"
  instance_class         = "db.t3.medium"
  username               = "cfb_user"
  password               = var.db_password
  port                   = "5432"
  allocated_storage      = "20"
  vpc_security_group_ids = [module.sg.alb-sg-id]
  db_subnet_group_name   = "CFB Subnets"
  maintenance_window     = "Mon:00:00-Mon:03:00"
  backup_window          = "03:00-06:00"
  parameter_group_name   = "db_parameter_group"
  subnet_ids             = module.vpc.subnet_ids
}

