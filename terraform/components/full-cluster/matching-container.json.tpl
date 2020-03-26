[
  {
    "name": "provider-matching",
    "image": "${image_address}",
    "cpu": 128,
    "memory": 512,
    "essential": true,
    "portMappings": [
      {
        "containerPort": 8080,
        "hostPort": 0
      }
    ],
    "environment": [
        {
          "name": "AWS_REGION",
          "value": "us-east-1"
        },
        {
          "name": "AWS_BUCKET",
          "value": "${s3_bucket}"
        }
    ]
  }
]
