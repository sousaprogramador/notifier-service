variable "project_name" {
  description = "Nome do projeto"
  type        = string
  default     = "notifier-service"
}

variable "container_port" {
  description = "Porta que o container expõe"
  type        = number
  default     = 3000
}
