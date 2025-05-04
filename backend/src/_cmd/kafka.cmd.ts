/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core'
import { AppModule } from '../app.module'
import { ConfluentKafkaServer } from '../kafka/confluent-kafka-servet'

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    strategy: new ConfluentKafkaServer({
      server: {
        'boootstrap.servers': 'localhost:9094',
      },
      consumer: {
        allowAutoTopicCreation: true,
        sessionTimeout: 10000,
        rebalanceTimeout: 10000,
      },
    }),
  })

  console.log('Kafka server started')
  await app.listen()
}

bootstrap()
