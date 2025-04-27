import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(@Body() createNotificationDto: CreateNotificationDto) {
    await this.notificationService.publishNotification(createNotificationDto);
    return { message: 'Notification request published successfully' };
  }
}
