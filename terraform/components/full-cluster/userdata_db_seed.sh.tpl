#!/bin/bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm" -o "session-manager-plugin.rpm"
sudo yum install -y session-manager-plugin.rpm
sudo systemctl enable amazon-ssm-agent
sudo systemctl start amazon-ssm-agent
yum install -y postgresql-server postgresql-devel
touch ~/.bashrc
sudo -s
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. /.nvm/nvm.sh
nvm install node
node -e "console.log('Running Node.js ' + process.version)"
yum install wget
yum install python3-pip
yum -y install unzip
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
export PATH=$PATH:/usr/local/bin
aws s3 cp s3://${seed_data_bucket} ~/ --recursive
cd root/seeder/
npm install
touch .env
echo 'DATABASE_URL=${database_url}
DATABASE_SCHEMA=${database_schema}
' >> ./.env
npm run db-delete
npm run db-create
npm run db-seed		
