import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { KafkaProducerService } from './producers/kafka.producer';

@Injectable()
export class NotificationService {
  constructor(private readonly kafkaProducerService: KafkaProducerService) {}

  async publishNotification(
    createNotificationDto: CreateNotificationDto,
  ): Promise<void> {
    await this.kafkaProducerService.sendMessage(
      'notifications-topic',
      createNotificationDto,
    );
  }
}
