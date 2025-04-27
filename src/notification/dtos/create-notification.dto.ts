import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationChannel } from '../enums/notification-channel.enum';

export class CreateNotificationDto {
  @ApiProperty({ example: 'mateus@exemplo.com' })
  @IsNotEmpty()
  @IsString()
  readonly recipient: string;

  @ApiProperty({ example: 'Seja bem-vindo!' })
  @IsNotEmpty()
  @IsString()
  readonly message: string;

  @ApiProperty({
    enum: NotificationChannel,
    example: NotificationChannel.EMAIL,
  })
  @IsNotEmpty()
  @IsEnum(NotificationChannel)
  readonly channel: NotificationChannel;
}
