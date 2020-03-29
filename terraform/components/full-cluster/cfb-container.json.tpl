[
  {
    "name": "bmore-responsive",
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
      { "name" : "VUE_APP_BASE_API_URL", "value" : "${vue_app_base_api_url}" },
      { "name" : "NODE_ENV", "value" : "${node_env}" },
      { "name" : "DATABASE_HOST", "value" : "${database_host}" },
      { "name" : "DATABASE_USER", "value" : "${database_user}" },
      { "name" : "DATABASE_PORT", "value" : "${database_port}" },
      { "name" : "DATABASE_NAME", "value" : "${database_name}" },
      { "name" : "JWT_KEY", "value" : "${jwt_key}" },
      { "name" : "BYPASS_LOGIN", "value" : "${bypass_login}" }
    ],
    "secrets": [{
      "name": "DATABASE_PASSWORD",
      "valueFrom": "${database_password_arn}"
    }]
  }
]
