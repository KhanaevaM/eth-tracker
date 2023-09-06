import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transaction.service';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from './transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService, TransactionRepository],
  controllers: [],
})
export class TransactionsModule {}
