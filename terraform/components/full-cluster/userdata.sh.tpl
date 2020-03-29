#!/bin/bash

# Install the SSM Agent RPM
yum install -y amazon-ssm-agent

yum install -y postgresql-server postgresql-devel

echo ECS_CLUSTER=${cluster_name} >> /etc/ecs/ecs.config
