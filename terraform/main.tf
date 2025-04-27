provider "aws" {
  region = "sa-east-1"
}

resource "aws_ecs_cluster" "this" {
  name = "notifier-service-cluster"
}

resource "aws_lb" "this" {
  name               = "notifier-service-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = ["<security-group-id>"]
  subnets            = ["<subnet-1>", "<subnet-2>"]
}

resource "aws_lb_target_group" "blue" {
  name        = "notifier-blue-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = "<vpc-id>"
  target_type = "ip"
  health_check {
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_target_group" "green" {
  name        = "notifier-green-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = "<vpc-id>"
  target_type = "ip"
  health_check {
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200-399"
    interval            = 30
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 2
  }
}

resource "aws_lb_listener" "this" {
  load_balancer_arn = aws_lb.this.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "forward"

    forward {
      target_group {
        arn    = aws_lb_target_group.blue.arn
        weight = 100
      }

      target_group {
        arn    = aws_lb_target_group.green.arn
        weight = 0
      }
    }
  }
}

resource "aws_ecs_task_definition" "this" {
  family                   = "notifier-service-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"

  container_definitions = jsonencode([
    {
      name      = "notifier-service",
      image     = "<ECR-URI>:latest",
      essential = true,
      portMappings = [
        {
          containerPort = 3000
        }
      ],
      environment = [
        { name = "PORT", value = "3000" }
      ],
      logConfiguration = {
        logDriver = "awslogs",
        options = {
          awslogs-group         = "/ecs/notifier-service",
          awslogs-region        = "sa-east-1",
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "blue" {
  name            = "notifier-service-blue"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = true
    subnets          = ["<subnet-1>", "<subnet-2>"]
    security_groups  = ["<security-group-id>"]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.blue.arn
    container_name   = "notifier-service"
    container_port   = 3000
  }
}

resource "aws_ecs_service" "green" {
  name            = "notifier-service-green"
  cluster         = aws_ecs_cluster.this.id
  task_definition = aws_ecs_task_definition.this.arn
  desired_count   = 0
  launch_type     = "FARGATE"

  network_configuration {
    assign_public_ip = true
    subnets          = ["<subnet-1>", "<subnet-2>"]
    security_groups  = ["<security-group-id>"]
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.green.arn
    container_name   = "notifier-service"
    container_port   = 3000
  }
}
