#!/bin/bash
set -e

echo "🚀 Atualizando ECS Service..."

aws ecs update-service \
  --cluster $ECS_CLUSTER_NAME \
  --service $ECS_SERVICE_NAME \
  --force-new-deployment \
  --region $AWS_REGION

echo "✅ Deploy concluído!"
