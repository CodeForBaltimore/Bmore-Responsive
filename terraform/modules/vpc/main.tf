terraform {
  required_version = ">= 0.12"
}

resource "aws_vpc" "vpc" {
  cidr_block = var.vpc_cidr
  tags = merge(
    {
      "Name" = "cfb-healthcare-rollcall-vpc"
    },
    var.mytags,
  )
}

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_subnet" "public-subnet" {
  count             = 3
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = element(var.public_subnet_cidrs, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "cfb-public-subnet-${count.index}"
  }
}

resource "aws_subnet" "private-subnet" {
  count             = 3
  vpc_id            = aws_vpc.vpc.id
  cidr_block        = element(var.private_subnet_cidrs, count.index)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "cfb-private-subnet-${count.index}"
  }
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.vpc.id

  tags = {
    Name = "CFB VPC IGW"
  }
}

# Set up Elastic IPs and NAT Gateways
resource "aws_eip" "nat-gw" {
  count = 3
}

resource "aws_nat_gateway" "nat-gw" {
  count         = 3
  allocation_id = aws_eip.nat-gw[count.index].id
  subnet_id     = aws_subnet.public-subnet[count.index].id
}

# Associate public routing rules to their subnets.
resource "aws_route_table" "public-route-table" {
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "CFB Public Subnets"
  }
}

resource "aws_route_table_association" "public-table-association" {
  count          = 3
  subnet_id      = aws_subnet.public-subnet[count.index].id
  route_table_id = aws_route_table.public-route-table.id
}

# Associate private routing rules to their subnets.
resource "aws_route_table" "private-route-table" {
  count  = 3
  vpc_id = aws_vpc.vpc.id
  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat-gw[count.index].id
  }

  tags = {
    Name = "CFB Subnets"
  }
}

resource "aws_route_table_association" "private-table-association" {
  count          = 3
  subnet_id      = aws_subnet.private-subnet[count.index].id
  route_table_id = aws_route_table.private-route-table[count.index].id
}

