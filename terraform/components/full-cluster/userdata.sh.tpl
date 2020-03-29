#!/bin/bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm" -o "session-manager-plugin.rpm"
sudo yum install -y session-manager-plugin.rpm
sudo systemctl enable amazon-ssm-agent
sudo systemctl start amazon-ssm-agent
yum install -y postgresql-server postgresql-devel


echo ECS_CLUSTER=${cluster_name} >> /etc/ecs/ecs.config
