terraform {
  required_version = ">= 0.12"
}

# Set up necessary IAM Roles for ECS Hosts

data "aws_iam_policy_document" "ecs_cluster_asg_policy" {
  statement {
    actions = [
      "ssmmessages:CreateControlChannel",
      "ssmmessages:CreateDataChannel",
      "ssmmessages:OpenControlChannel",
      "ssmmessages:OpenDataChannel"
    ]
    effect = "Allow"

    resources = ["*"]
  }

  statement {
    actions = [
      "s3:GetEncryptionConfiguration"
    ]
    effect    = "Allow"
    resources = ["*"]
  }

  statement {

    actions = [
      "kms:Decrypt"
    ]

    effect = "Allow"

    resources = ["*"]
  }

  statement {
    actions = [
      "ecs:DeregisterContainerInstance",
      "ecs:DiscoverPollEndpoint",
      "ecs:Poll",
      "ecs:RegisterContainerInstance",
      "ecs:StartTelemetrySession",
      "ecs:Submit*",
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = [
      "*",
    ]
  }

  statement {
    actions = [
      "s3:*",
    ]

    resources = [
      var.seed_data_bucket_arn,
      "${var.seed_data_bucket_arn}/*",
      var.output_bucket_arn,
      "${var.output_bucket_arn}/*",
    ]
  }
}

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "ecs_cluster" {
  path = "/"
  name = "bmore-responsive_ecs_cluster_role"

  assume_role_policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": "sts:AssumeRole",
            "Principal": {
               "Service": "ec2.amazonaws.com"
            },
            "Effect": "Allow",
            "Sid": ""
        }
    ]
}
EOF

}

resource "aws_iam_role_policy" "ecs_cluster_asg_policy" {
  name_prefix = "ecs-cluster-policy-"
  role        = aws_iam_role.ecs_cluster.id
  policy      = data.aws_iam_policy_document.ecs_cluster_asg_policy.json
}

resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
  role       = aws_iam_role.ecs_cluster.name
}

resource "aws_iam_instance_profile" "ecs_cluster_asg_profile" {
  name_prefix = "ecs_cluster_asg_profile-"
  role        = aws_iam_role.ecs_cluster.name
}

# Create the ECR Repositories for the containers
resource "aws_ecr_repository" "bmore-responsive-api" {
  name = "bmore-responsive"
}

resource "aws_ecr_repository_policy" "bmore-responsive-api-policy" {
  repository = aws_ecr_repository.bmore-responsive-api.name

  policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Sid": "new policy",
            "Effect": "Allow",
            "Principal": {
              "AWS": "${aws_iam_role.ecs_cluster.arn}"
            },
            "Action": [
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:DescribeRepositories",
                "ecr:GetRepositoryPolicy",
                "ecr:ListImages",
                "ecr:DeleteRepository",
                "ecr:BatchDeleteImage",
                "ecr:SetRepositoryPolicy",
                "ecr:DeleteRepositoryPolicy"
            ]
        }
    ]
}
EOF

}

data "aws_iam_policy_document" "task_execution_role_permission_policy_document" {
  statement {
    effect = "Allow"
    actions = [
      "ssm:GetParameters",
      "secretsmanager:GetSecretValue",
      "kms:Decrypt"
    ]
    resources = [
      "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/*",
      "arn:aws:secretsmanager:${var.aws_region}:${data.aws_caller_identity.current.account_id}:secret:*",
      "arn:aws:kms:${var.aws_region}:${data.aws_caller_identity.current.account_id}:key/*"
    ]
  }

  statement {

    effect = "Allow"
    actions = [
      "logs:CreateLogGroup"
    ]
    resources = [
      "*"
    ]
  }
}

resource "aws_iam_policy" "task_execution_role_permission_policy" {
  name_prefix = "secrets-manager-access-"
  policy      = data.aws_iam_policy_document.task_execution_role_permission_policy_document.json
}

data "aws_iam_policy_document" "task_execution_role_assume_role_policy_document" {
  statement {
    effect = "Allow"
    principals {
      identifiers = ["ecs-tasks.amazonaws.com"]
      type        = "Service"
    }
    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "task_execution_role" {
  name               = "ecsTaskExecutionRole"
  assume_role_policy = data.aws_iam_policy_document.task_execution_role_assume_role_policy_document.json
}

resource "aws_iam_role_policy_attachment" "task_execution_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy" // AWS provided policy
  role       = aws_iam_role.task_execution_role.name
}

resource "aws_iam_role_policy_attachment" "task_execution_permissions_policy_attachment" {
  policy_arn = aws_iam_policy.task_execution_role_permission_policy.arn
  role       = aws_iam_role.task_execution_role.name
}


resource "aws_ecs_cluster" "ecs_cluster" {
  name = var.cluster_name
}

resource "aws_cloudwatch_log_group" "cfb-api-logs" {
  name = "cfb-api-logs"
}

resource "aws_ecs_task_definition" "bmore-responsive_ecs_task_definition" {
  family                  = "bmore-responsive"
  container_definitions   = var.bmore-responsive_container_definitions
  //task_role_arn         = "arn:aws:iam::180104022864:role/bmore-responsive_ecs_cluster_role"
  execution_role_arn      = aws_iam_role.task_execution_role.arn
  //awslogs-create-group    = "true"
  //awslogs-region          = "${var.aws_region}"
  //awslogs-group           = aws_cloudwatch_log_group.cfb-api-logs.arn
  //awslogs-stream-prefix   = "cfb-api-"
}

resource "aws_ecs_service" "pricer_ecs_service" {
  name            = "bmore-responsive"
  cluster         = aws_ecs_cluster.ecs_cluster.id
  task_definition = aws_ecs_task_definition.bmore-responsive_ecs_task_definition.arn
  desired_count   = var.bmore-responsive_desired_count

  load_balancer {
    target_group_arn = var.bmore-responsive_target_group_arn
    container_name   = var.bmore-responsive_container_name
    container_port   = var.bmore-responsive_container_port
  }
}

