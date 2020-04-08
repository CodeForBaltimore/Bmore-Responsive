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
    image_address        = module.ecs_cluster.cfb_registry
    s3_bucket            = module.s3.output_bucket_name
    vue_app_base_api_url = "bmoreres.codeforbaltimore.org"
    node_env             = "development"
    database_host        = module.db.this_db_instance_address
    database_user        = module.db.this_db_instance_username
    //    database_password_arn = aws_secretsmanager_secret_version.db_password.arn
    database_port     = module.db.this_db_instance_port
    database_name     = "healthcareRollcallDB"
    jwt_key           = "abc123"
    bypass_login      = "false"
    aws_region        = var.aws_region
    database_password = var.db_password
    smtp_host         = "smtp.gmail.com"
    smtp_port         = "587"
    smtp_user         = "no-reply@codeforbaltimore.org"
    smtp_password     = var.smtp_password
  }
}


resource "aws_secretsmanager_secret" "db_password" {
  name_prefix = "db_password"

}

resource "aws_secretsmanager_secret_version" "db_password" {
  secret_id     = aws_secretsmanager_secret.db_password.id
  secret_string = var.db_password
}

data "template_file" "user_data" {
  template = file("userdata.sh.tpl")
  vars = {
    cluster_name = "bmore-responsive-cluster"
  }
}

data "template_file" "seed_user_data" {
  template = file("userdata_db_seed.sh.tpl")
  vars = {
    database_url = "postgres://${module.db.this_db_instance_username}:${var.db_password}@${module.db.this_db_instance_address}:${module.db.this_db_instance_port}/healthcareRollcallDB"
    database_schema = "public"
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
  source           = "../../modules/sg"
  vpc_id           = module.vpc.vpc-id
  db_ingress_cidrs = module.vpc.private_subnet_cidrs
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
  cfb_app_port    = 3000
  certificate_arn = module.certificate.certificate_arn
}

module "waf" {
  source          = "../../modules/waf"
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
  bmore-responsive_container_port        = "3000"
  bmore-responsive_container_definitions = data.template_file.cfb_ecs_task_definition.rendered
  aws_region                             = var.aws_region
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
  vpc_security_group_ids = [module.sg.sg_postgresql_id]
  db_subnet_group_name   = "CFB Subnets"
  maintenance_window     = "Mon:00:00-Mon:03:00"
  backup_window          = "03:00-06:00"
  parameter_group_name   = "db_parameter_group"
  subnet_ids             = module.vpc.subnet_ids
}

module "ec2" {
  source                 = "../../modules/ec2"
  subnet_ids             = module.vpc.subnet_ids
  app_name               = "cfb"
  tags = { Name =  "healthcare_rollcall_db_seeder"}
  ec2_ami = "ami-044bf85e844eddde5"
  ec2_instance_type = "m5.large"
  ec2_instance_count = "1"
  ecs_role               = module.ecs_cluster.ecs_role
  user_data = data.template_file.seed_user_data.rendered
  vpc_sg = [module.sg.ecs_sg_id]
}


