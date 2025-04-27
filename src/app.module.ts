import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { PrometheusMetricsService } from './metrics/prometheus.metrics';
import { NotificationModule } from './notification/notification.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule.register(),
    NotificationModule,
    HealthModule,
  ],
  providers: [PrometheusMetricsService],
})
export class AppModule {}
