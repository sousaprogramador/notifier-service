#!/bin/bash
set -e

GIT_SHA=$(git rev-parse --short HEAD)

echo "🚀 Buildando imagem Docker com SHA $GIT_SHA..."

docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$GIT_SHA .

echo "🚀 Logando no ECR..."

aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

echo "🚀 Fazendo push da imagem com SHA..."

docker push $ECR_REGISTRY/$ECR_REPOSITORY:$GIT_SHA
