import { retry, circuitBreaker, ConsecutiveBreaker } from 'cockatiel';
import { NotificationChannel } from '../enums/notification-channel.enum';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrometheusMetricsService } from '../../metrics/prometheus.metrics';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private kafkaConsumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly prometheusMetricsService: PrometheusMetricsService,
  ) {}

  async onModuleInit() {
    // Kafka initialization (já montado antes)
  }

  private async dispatchNotification(
    recipient: string,
    message: string,
    channel: NotificationChannel,
  ) {
    const retryPolicy = retry().attempts(3); // Tenta 3 vezes se falhar

    const breaker = circuitBreaker(new ConsecutiveBreaker(5)); // Abre o circuito se 5 falharem seguidas

    const sendNotification = async () => {
      switch (channel) {
        case NotificationChannel.EMAIL:
          console.log(`📧 Email enviado para ${recipient}`);
          break;
        case NotificationChannel.SMS:
          console.log(`📱 SMS enviado para ${recipient}`);
          break;
        case NotificationChannel.WHATSAPP:
          console.log(`💬 WhatsApp enviado para ${recipient}`);
          break;
        case NotificationChannel.PUSH:
          console.log(`📲 Push Notification enviado para ${recipient}`);
          break;
        default:
          console.error('❌ Canal de notificação desconhecido!');
          throw new Error('Canal de notificação desconhecido!');
      }
    };

    await retryPolicy.execute(() => breaker.execute(() => sendNotification()));

    this.prometheusMetricsService.incrementNotificationsSent();
  }
}
