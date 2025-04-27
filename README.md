# 🚀 Notifier Service - Infraestrutura e Deploy Automático

## 🛠️ Tecnologias

- NestJS + TypeScript
- Kafka + Redis + MongoDB (local)
- Docker Compose para Dev
- Prometheus + Grafana + Alertmanager
- Terraform AWS ECS + CodeDeploy + ALB Blue/Green

## 🚀 Rodar Local

docker-compose -f docker-compose.yml -f docker-compose.prometheus.yml up -d

Acesse:

- App: http://localhost:3000
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001
- Alertmanager: http://localhost:9093

Grafana Login:

- Usuário: admin
- Senha: admin

Importar dashboards:

- ID 1860 (Node)
- ID 11074 (ECS)
- ID 7589 (Kafka)
- ID 763 (Redis)

## ☁️ Deploy AWS

cd terraform
terraform init
terraform plan
terraform apply

O Terraform cria:

- Cluster ECS Fargate
- Task Definitions
- Services Blue/Green
- ALB Listener com Target Groups
- CodeDeploy com Canary Deploy automático 10% ➔ 20% ➔ 50% ➔ 100%

Acesso ao Load Balancer:
terraform output alb_dns

## 📈 Monitoramento e Alertas

- CPU, Memória, Kafka Lag
- Alertas de falha Slack via Alertmanager
- Rollback automático se Canary falhar

## 📬 Alertas Slack

Configurar webhook no alertmanager.yml:

api_url: 'https://hooks.slack.com/services/XXXXXXXXX/YYYYYYYYY/ZZZZZZZZZZZZZZ'

## 🚀 Promotion Manual Blue/Green (Zero Downtime)

Para mover tráfego manualmente entre Blue e Green:

terraform apply -var="blue_weight=90" -var="green_weight=10"
terraform apply -var="blue_weight=80" -var="green_weight=20"
terraform apply -var="blue_weight=50" -var="green_weight=50"
terraform apply -var="blue_weight=0" -var="green_weight=100"

Para reverter para a versão Blue:

terraform apply -var="blue_weight=100" -var="green_weight=0"

✅ Permite promoções suaves e rollback em segundos sem downtime.

## 📋 Resumo Final

✅ Sistema com **deploys automáticos e graduais**  
✅ **Rollback automático** em caso de falhas  
✅ **Monitoramento real-time** de todos os serviços  
✅ **Alertas automáticos** para incidentes críticos  
✅ **Dashboards de observabilidade de alta qualidade**

---

# 🚀 Ready for Production!
