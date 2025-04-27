import { Injectable } from '@nestjs/common';
import { Counter } from 'prom-client';

@Injectable()
export class PrometheusMetricsService {
  public readonly notificationsSentCounter: Counter<string>;

  constructor() {
    this.notificationsSentCounter = new Counter({
      name: 'notifications_sent_total',
      help: 'Total de notificações enviadas com sucesso',
    });
  }

  incrementNotificationsSent() {
    this.notificationsSentCounter.inc();
  }
}
