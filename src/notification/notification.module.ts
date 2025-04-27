import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { KafkaProducerService } from './producers/kafka.producer';
import { KafkaConsumerService } from './consumers/kafka.consumer';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, KafkaProducerService, KafkaConsumerService],
})
export class NotificationModule {}
