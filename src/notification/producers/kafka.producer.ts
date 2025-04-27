import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class KafkaProducerService implements OnModuleInit {
  private kafkaProducer: Producer;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: this.configService.get<string>('KAFKA_CLIENT_ID'),
      brokers: [this.configService.get<string>('KAFKA_BROKER')],
    });

    this.kafkaProducer = kafka.producer();
    await this.kafkaProducer.connect();
  }

  async sendMessage(topic: string, message: any): Promise<void> {
    await this.kafkaProducer.send({
      topic,
      messages: [
        {
          value: JSON.stringify(message),
        },
      ],
    });
  }
}
