import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
  RedisHealthIndicator,
} from '@nestjs/terminus';
import { Kafka } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator,
    private redis: RedisHealthIndicator,
    private configService: ConfigService,
  ) {}

  @HealthCheck()
  async check() {
    const kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
    });

    const kafkaAdmin = kafka.admin();
    await kafkaAdmin.connect();
    await kafkaAdmin.disconnect();

    return this.health.check([
      async () => this.mongoose.pingCheck('mongodb', { timeout: 300 }),
      async () =>
        this.redis.checkHealth('redis', {
          timeout: 300,
          host: this.configService.get<string>('REDIS_HOST'),
          port: this.configService.get<number>('REDIS_PORT'),
        }),
    ]);
  }
}
