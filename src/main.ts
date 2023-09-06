import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cron from 'node-cron';
import { TransactionsService } from './transactions/transaction.service';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  dotenv.config();

  cron.schedule('*/1 * * * *', async () => {
    const transactionsService = app.get(TransactionsService);
    await transactionsService.getAllTransactions();
  });

  await app.listen(3000);
}
bootstrap();
